use crate::runtime::action::flow::REASON;
use crate::runtime::action::Tick;
use crate::runtime::args::{RtArgs, RtValue};
use crate::runtime::blackboard::BlackBoard;
use crate::runtime::rtree::rnode::RNodeId;
use crate::runtime::{RtOk, RtResult, RuntimeError, TickResult};
use crate::tracer::Event::NewState;
use crate::tracer::{Event, Tracer};
use std::collections::{HashMap, VecDeque};
use std::fmt::{Display, Formatter};

pub type Timestamp = usize;

pub struct TreeContext<'a> {
    /// Storage
    bb: &'a mut BlackBoard,

    tracer: &'a mut Tracer,

    /// The call stack
    stack: VecDeque<RNodeId>,

    /// The latest state for the node
    state: HashMap<RNodeId, RNodeState>,

    /// The latest tick for the node
    ts_map: HashMap<RNodeId, Timestamp>,

    /// Current tick
    curr_ts: Timestamp,

    /// the max amount of ticks
    tick_limit: Timestamp,
}

impl<'a> TreeContext<'a> {
    pub fn bb(&mut self) -> &mut BlackBoard {
        self.bb
    }
    pub fn new(bb: &'a mut BlackBoard, tracer: &'a mut Tracer, tick_limit: Timestamp) -> Self {
        Self {
            bb,
            tracer,
            stack: Default::default(),
            state: Default::default(),
            ts_map: Default::default(),
            curr_ts: 1,
            tick_limit,
        }
    }
}

impl<'a> TreeContext<'a> {
    pub fn trace(&mut self, ev: Event) {
        self.tracer.trace(self.curr_ts, ev)
    }
    pub(crate) fn next_tick(&mut self) -> RtOk {
        self.curr_ts += 1;
        self.trace(Event::NextTick);
        debug!(target:"root", "tick up the flow to:{}",self.curr_ts);
        if self.tick_limit != 0 && self.curr_ts >= self.tick_limit {
            Err(RuntimeError::Stopped(format!(
                "the limit of ticks are exceeded on {}",
                self.curr_ts
            )))
        } else {
            Ok(())
        }
    }

    pub(crate) fn root_state(&self, root: RNodeId) -> Tick {
        self.state
            .get(&root)
            .ok_or(RuntimeError::uex(format!("the root node {root} is absent")))
            .and_then(RNodeState::to_tick_result)
    }

    pub(crate) fn is_curr_ts(&self, id: &RNodeId) -> bool {
        self.ts_map
            .get(id)
            .map(|e| *e == self.curr_ts)
            .unwrap_or(false)
    }
    pub fn curr_ts(&self) -> Timestamp {
        self.curr_ts
    }

    pub(crate) fn push(&mut self, id: RNodeId) -> RtOk {
        self.tracer.right();
        self.stack.push_back(id);
        Ok(())
    }
    pub(crate) fn pop(&mut self) -> RtResult<Option<RNodeId>> {
        let pop_node = self.stack.pop_back();
        self.tracer.left();
        Ok(pop_node)
    }
    pub(crate) fn peek(&self) -> RtResult<Option<&RNodeId>> {
        if self.stack.is_empty() {
            Ok(None)
        } else {
            Ok(self.stack.back())
        }
    }

    pub(crate) fn new_state(
        &mut self,
        id: RNodeId,
        state: RNodeState,
    ) -> RtResult<Option<RNodeState>> {
        self.ts_map.insert(id, self.curr_ts);
        self.trace(NewState(id, state.clone()));
        Ok(self.state.insert(id, state))
    }
    pub(crate) fn state_in_ts(&self, id: RNodeId) -> RNodeState {
        let actual_state = self
            .state
            .get(&id)
            .map(|s| s.clone())
            .unwrap_or(RNodeState::Ready(RtArgs::default()));
        if self.is_curr_ts(&id) {
            actual_state
        } else {
            RNodeState::Ready(actual_state.args())
        }
    }
}

pub type ChildIndex = usize;

/// The current state of the node.
/// RtArgs here represent the arguments that are passed between ticks and used as meta info
#[derive(Clone, Debug)]
pub enum RNodeState {
    Ready(RtArgs),
    Running(RtArgs),
    Success(RtArgs),
    Failure(RtArgs),
}

impl Display for RNodeState {
    fn fmt(&self, f: &mut Formatter<'_>) -> std::fmt::Result {
        match self {
            RNodeState::Ready(args) => {
                f.write_str(format!("Ready({})", args).as_str())?;
            }
            RNodeState::Running(args) => {
                f.write_str(format!("Running({})", args).as_str())?;
            }
            RNodeState::Success(args) => {
                f.write_str(format!("Success({})", args).as_str())?;
            }
            RNodeState::Failure(args) => {
                f.write_str(format!("Failure({})", args).as_str())?;
            }
        }
        Ok(())
    }
}

impl RNodeState {
    pub fn from(tick_args: RtArgs, res: TickResult) -> RNodeState {
        match res {
            TickResult::Success => RNodeState::Success(tick_args),
            TickResult::Failure(v) => RNodeState::Failure(tick_args.with(REASON, RtValue::str(v))),
            TickResult::Running => RNodeState::Running(tick_args),
        }
    }
    pub fn to_tick_result(&self) -> RtResult<TickResult> {
        match &self {
            RNodeState::Ready(_) => Err(RuntimeError::uex(format!(
                "the ready is the unexpected state for "
            ))),
            RNodeState::Running(_) => Ok(TickResult::running()),
            RNodeState::Success(_) => Ok(TickResult::success()),
            RNodeState::Failure(args) => {
                let reason = args
                    .find(REASON.to_string())
                    .and_then(RtValue::as_string)
                    .unwrap_or_default();

                Ok(TickResult::Failure(reason))
            }
        }
    }

    pub fn is_running(&self) -> bool {
        match self {
            RNodeState::Running { .. } => true,
            _ => false,
        }
    }
    pub fn is_ready(&self) -> bool {
        match self {
            RNodeState::Ready(_) => true,
            _ => false,
        }
    }
    pub fn is_finished(&self) -> bool {
        match self {
            RNodeState::Success(_) | RNodeState::Failure(_) => true,
            _ => false,
        }
    }

    pub fn args(&self) -> RtArgs {
        match self {
            RNodeState::Ready(tick_args)
            | RNodeState::Running(tick_args)
            | RNodeState::Failure(tick_args)
            | RNodeState::Success(tick_args) => tick_args.clone(),
        }
    }
}
