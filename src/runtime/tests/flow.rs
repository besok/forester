use crate::runtime::action::builtin::data::GenerateData;
use crate::runtime::action::builtin::Fail;
use crate::runtime::action::{Action, Impl, Tick};
use crate::runtime::args::{RtArgs, RtValue};
use crate::runtime::context::TreeContext;
use crate::runtime::tests::fb;
use crate::runtime::TickResult;

struct StoreTick;

impl Impl for StoreTick {
    fn tick(&self, args: RtArgs, ctx: &mut TreeContext) -> Tick {
        let ts = ctx.curr_ts()?;
        ctx.bb().put("tick".to_string(), RtValue::int(ts as i64))?;

        Ok(TickResult::Success)
    }
}

#[test]
fn simple_sequence() {
    let mut fb = fb("flow/sequence");

    fb.register_action("store", Action::sync(GenerateData::new(|v| v)));
    fb.register_action("store_tick", Action::sync(StoreTick));

    let mut f = fb.build().unwrap();
    let result = f.start();
    assert_eq!(result, Ok(TickResult::success()));

    let x =
        f.bb.get("a".to_string())
            .ok()
            .flatten()
            .and_then(|v| v.clone().as_string())
            .unwrap();
    assert_eq!(x.as_str(), "1");

    let x =
        f.bb.get("b".to_string())
            .ok()
            .flatten()
            .and_then(|v| v.clone().as_string())
            .unwrap();
    assert_eq!(x.as_str(), "2");

    let x =
        f.bb.get("c".to_string())
            .ok()
            .flatten()
            .and_then(|v| v.clone().as_string())
            .unwrap();
    assert_eq!(x.as_str(), "3");

    let x =
        f.bb.get("tick".to_string())
            .ok()
            .flatten()
            .and_then(|v| v.clone().as_int())
            .unwrap();
    assert_eq!(x, 1);
}

#[test]
fn seq_restart_all_children() {
    let mut fb = fb("flow/sequence_restart_children");

    fb.register_action(
        "store",
        Action::sync(GenerateData::new(|v| {
            let curr = v.as_int().unwrap_or(0);
            RtValue::int(curr + 1)
        })),
    );
    fb.register_action("store_tick", Action::sync(StoreTick));
    fb.register_action("fail", Action::sync(Fail));

    let mut f = fb.build().unwrap();
    let result = f.start();
    assert_eq!(result, Ok(TickResult::failure("fail".to_string())));

    let x =
        f.bb.get("k1".to_string())
            .ok()
            .flatten()
            .and_then(|v| v.clone().as_int())
            .unwrap();
    assert_eq!(x, 5);

    let x =
        f.bb.get("k2".to_string())
            .ok()
            .flatten()
            .and_then(|v| v.clone().as_int())
            .unwrap();
    assert_eq!(x, 5);

    let x =
        f.bb.get("tick".to_string())
            .ok()
            .flatten()
            .and_then(|v| v.clone().as_int())
            .unwrap();
    assert_eq!(x, 5);
}

#[test]
fn mseq_restart_all_children() {
    let mut fb = fb("flow/msequence_restart_children");

    fb.register_action(
        "store",
        Action::sync(GenerateData::new(|v| {
            let curr = v.as_int().unwrap_or(0);
            RtValue::int(curr + 1)
        })),
    );
    fb.register_action("store_tick", Action::sync(StoreTick));
    fb.register_action("fail", Action::sync(Fail));

    let mut f = fb.build().unwrap();
    let result = f.start();
    assert_eq!(result, Ok(TickResult::failure("fail".to_string())));

    let x =
        f.bb.get("k1".to_string())
            .ok()
            .flatten()
            .and_then(|v| v.clone().as_int())
            .unwrap();
    assert_eq!(x, 1);

    let x =
        f.bb.get("k2".to_string())
            .ok()
            .flatten()
            .and_then(|v| v.clone().as_int())
            .unwrap();
    assert_eq!(x, 1);

    let x =
        f.bb.get("tick".to_string())
            .ok()
            .flatten()
            .and_then(|v| v.clone().as_int())
            .unwrap();
    assert_eq!(x, 1);
}