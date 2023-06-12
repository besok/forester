use std::collections::HashMap;
use std::fmt::{Display, Formatter, Write, write};
use std::str::FromStr;
use itertools::Itertools;
use parsit::step::Step;
use strum::ParseError;
use strum_macros::EnumString;
use strum_macros::Display;
use crate::tree::project::{AliasName, TreeName};
use crate::tree::project::invocation::Invocation;

pub type Key = String;

#[derive(Debug, Copy, Clone, PartialEq)]
pub enum Number {
    Int(i64),
    Float(f64),
    Hex(i64),
    Binary(isize),
}

#[derive(Clone, Debug, PartialEq)]
pub struct StringLit(pub String);

#[derive(Debug, Clone, PartialEq)]
pub enum Bool {
    True,
    False,
}

#[derive(Debug, Clone, PartialEq)]
pub enum Message {
    Num(Number),
    String(StringLit),
    Bool(Bool),
    Array(Vec<Message>),
    Object(HashMap<String, Message>),

}

impl Display for Message {
    fn fmt(&self, f: &mut Formatter<'_>) -> std::fmt::Result {
        match self {
            Message::Num(v) => {
                match v {
                    Number::Int(v) => write!(f, "{}", v),
                    Number::Float(v) => write!(f, "{}", v),
                    Number::Hex(v) => write!(f, "{}", v),
                    Number::Binary(v) => write!(f, "{}", v),
                }
            }
            Message::String(v) => write!(f, "{}", v.0),
            Message::Bool(b) => match b {
                Bool::True => write!(f, "true"),
                Bool::False => write!(f, "false"),
            },
            Message::Array(array) => {
                let mut list = f.debug_list();
                let strings: Vec<_> = array.iter().map(|v| format!("{}", v)).collect();
                list.entries(strings);
                list.finish()
            }
            Message::Object(obj) => {
                let mut map = f.debug_map();
                let entries: Vec<_> = obj.iter().map(|(k, v)| (k, format!("{}", v))).collect();
                map.entries(entries);
                map.finish()
            }
        }
    }
}


impl Message {
    pub fn same(&self, mt: &MesType) -> bool {
        match (&self, mt) {
            (Message::Num(_), MesType::Num) => true,
            (Message::String(_), MesType::String) => true,
            (Message::Bool(_), MesType::Bool) => true,
            (Message::Array(_), MesType::Array) => true,
            (Message::Object(_), MesType::Object) => true,
            _ => false
        }
    }

    pub fn str(v: &str) -> Self {
        Message::String(StringLit(v.to_string()))
    }
    pub fn bool(v: bool) -> Self {
        if v {
            Message::Bool(Bool::True)
        } else {
            Message::Bool(Bool::False)
        }
    }
    pub fn int(v: i64) -> Self {
        Message::Num(Number::Int(v))
    }
    pub fn float(v: f64) -> Self {
        Message::Num(Number::Float(v))
    }
    pub fn object(pairs: Vec<(String, Message)>) -> Self {
        Message::Object(HashMap::from_iter(pairs))
    }
    pub fn array(elems: Vec<Message>) -> Self {
        Message::Array(elems)
    }
}

#[derive(Debug, Clone, PartialEq)]
pub enum Call {
    Invocation(Key, Arguments),
    InvocationCapturedArgs(Key),
    Lambda(TreeType, Calls),
    Decorator(TreeType, Arguments, Box<Call>),
}

impl Call {
    pub fn key(&self) -> Option<Key> {
        match self {
            Call::Invocation(k, _) => Some(k.clone()),
            Call::InvocationCapturedArgs(k) => Some(k.clone()),
            Call::Lambda(_, _) => None,
            Call::Decorator(_, _, _) => None
        }
    }
    pub fn arguments(&self) -> Arguments{
        match self {
            Call::Invocation(_, args) => args.clone(),
            Call::InvocationCapturedArgs(_) => Arguments::default(),
            Call::Lambda(_, _) => Arguments::default(),
            Call::Decorator(_, args, _) => args.clone(),
        }
    }

    pub fn invocation(id: &str, args: Arguments) -> Self {
        Call::Invocation(id.to_string(), args)
    }
    pub fn invocation_with_capture(id: &str) -> Self {
        Call::InvocationCapturedArgs(id.to_string())
    }
    pub fn lambda(tpe: TreeType, calls: Calls) -> Self {
        Call::Lambda(tpe, calls)
    }
    pub fn decorator(tpe: TreeType, args: Arguments, call: Call) -> Self {
        Call::Decorator(tpe, args, Box::new(call))
    }
}

#[derive(Clone, Debug, Default, PartialEq)]
pub struct Calls {
    pub elems: Vec<Call>,
}

impl Calls {
    pub fn new(elems: Vec<Call>) -> Self {
        Calls { elems }
    }
}

#[derive(Clone, Debug, PartialEq)]
pub struct Param {
    pub name: Key,
    pub tpe: MesType,
}

impl Param {
    pub fn new(id: &str, tpe: MesType) -> Self {
        Param { name: id.to_string(), tpe }
    }
}

#[derive(Clone, Debug, Default, PartialEq)]
pub struct Params {
    pub params: Vec<Param>,
}

impl Params {
    pub fn new(params: Vec<Param>) -> Self {
        Params { params }
    }
}

#[derive(Clone, Debug, PartialEq)]
pub enum ArgumentRhs {
    Id(Key),
    Mes(Message),
    Call(Call),
}

impl ArgumentRhs {
    pub fn get_call(&self) -> Option<&Call> {
        match self {
            ArgumentRhs::Call(call) => Some(call),
            _ => None
        }
    }
}

impl Display for ArgumentRhs {
    fn fmt(&self, f: &mut Formatter<'_>) -> std::fmt::Result {
        match self {
            ArgumentRhs::Id(id) => f.write_str(id),
            ArgumentRhs::Mes(m) => write!(f, "{}", m),
            ArgumentRhs::Call(c) => {
                match c {
                    Call::Invocation(name, args) => {
                        write!(f, "{}({})", name, args)
                    }
                    Call::InvocationCapturedArgs(name) => {
                        write!(f, "{}(..)", name)
                    }
                    Call::Lambda(tpe, _) => {
                        write!(f, "{}...", tpe)
                    }
                    Call::Decorator(tpe, args, call) => {
                        write!(f, "{}({})...", tpe, args)
                    }
                }
            }
        }
    }
}

#[derive(Clone, Debug, PartialEq)]
pub enum Argument {
    Assigned(Key, ArgumentRhs),
    Unassigned(ArgumentRhs),
}

impl Argument {
    pub fn has_name(&self, key: &Key) -> bool {
        match self {
            Argument::Assigned(k, _) if k == key => true,
            _ => false
        }
    }
    pub fn value(&self) -> &ArgumentRhs {
        match self {
            Argument::Assigned(_, v)
            | Argument::Unassigned(v) => v
        }
    }
}


impl Display for Argument {
    fn fmt(&self, f: &mut Formatter<'_>) -> std::fmt::Result {
        match self {
            Argument::Assigned(k, rhs) => write!(f, "{}={}", k, rhs),
            Argument::Unassigned(rhs) => write!(f, "{}", rhs)
        }
    }
}


impl Argument {
    pub fn id(v: &str) -> Self {
        Argument::Unassigned(ArgumentRhs::Id(v.to_string()))
    }
    pub fn mes(v: Message) -> Self {
        Argument::Unassigned(ArgumentRhs::Mes(v))
    }
    pub fn call(v: Call) -> Self {
        Argument::Unassigned(ArgumentRhs::Call(v))
    }
    pub fn id_id(lhs: &str, rhs: &str) -> Self {
        Argument::Assigned(lhs.to_string(), ArgumentRhs::Id(rhs.to_string()))
    }
    pub fn id_mes(lhs: &str, rhs: Message) -> Self {
        Argument::Assigned(lhs.to_string(), ArgumentRhs::Mes(rhs))
    }
    pub fn id_call(lhs: &str, rhs: Call) -> Self {
        Argument::Assigned(lhs.to_string(), ArgumentRhs::Call(rhs))
    }
}

#[derive(Clone, Debug, Default, PartialEq)]
pub struct Arguments {
    pub args: Vec<Argument>,
}

impl Display for Arguments {
    fn fmt(&self, f: &mut Formatter<'_>) -> std::fmt::Result {
        let str = &self.args.iter().map(|a| { format!("{}", a) }).join(",");
        write!(f, "{}", str)
    }
}


#[derive(Clone, Debug, Default, PartialEq)]
pub struct ShortDisplayArguments(pub Arguments);

#[derive(Clone, Debug, PartialEq)]
pub struct ShortDisplayArgument(pub ArgumentRhs);

impl Display for ShortDisplayArgument {
    fn fmt(&self, f: &mut Formatter<'_>) -> std::fmt::Result {
        let short_mes = |m: &Message| match m {
            Message::Array(_) => "[..]".to_string(),
            Message::Object(_) => "{..}".to_string(),
            m => format!("{}", m)
        };
        match &self.0 {
            ArgumentRhs::Id(id) => write!(f, "{}", id),
            ArgumentRhs::Mes(m) => write!(f, "{}", short_mes(m)),
            ArgumentRhs::Call(c) => {
                match c {
                    Call::Invocation(t, _) => write!(f, "{}(..)", t),
                    Call::InvocationCapturedArgs(t) => write!(f, "{}(..)", t),
                    Call::Lambda(t, _) => write!(f, "{}..", t),
                    Call::Decorator(t, _, _) => write!(f, "{}(..)", t),
                }
            }
        }
    }
}

impl Display for ShortDisplayArguments {
    fn fmt(&self, f: &mut Formatter<'_>) -> std::fmt::Result {
        let str = &self.0.args.iter().map(|a| {
            match a {
                Argument::Assigned(k, rhs) => {
                    format!("{}={}", k, ShortDisplayArgument(rhs.clone()))
                }
                Argument::Unassigned(rhs) => {
                    format!("{}", ShortDisplayArgument(rhs.clone()))
                }
            }
        }).join(",");
        write!(f, "{}", str)
    }
}


impl<'a> Arguments {
    pub fn new(args: Vec<Argument>) -> Self {
        Self { args }
    }
}

#[derive(Display, Debug, Clone, Eq, PartialEq, EnumString)]
#[strum(serialize_all = "snake_case")]
pub enum TreeType {
    Root,
    Parallel,
    Sequence,
    MSequence,
    RSequence,
    Fallback,
    RFallback,
    // decorators
    Inverter,
    ForceSuccess,
    ForceFail,
    Repeat,
    Retry,
    Timeout,
    // actions
    Impl,
    Cond,
}

impl TreeType {
    pub fn is_decorator(&self) -> bool {
        match self {
            TreeType::Inverter |
            TreeType::ForceSuccess |
            TreeType::ForceFail |
            TreeType::Repeat |
            TreeType::Retry |
            TreeType::Timeout => true,
            _ => false
        }
    }
}

pub fn validate_lambda<'a, 'b>(tpe: &'a TreeType, args: &'a Arguments, calls: &'a Calls) -> Result<(), &'b str> {
    match tpe {
        TreeType::Impl | TreeType::Cond => Err("the types impl or cond should have declaration and get called by name"),

        _ if tpe.is_decorator() => {
            if calls.elems.len() != 1 {
                Err("any decorator should have only one child")
            } else {
                Ok(())
            }
        }

        _ => {
            if args.args.is_empty() {
                Ok(())
            } else {
                Err("any lambda invocation should not have arguments")
            }
        }
    }
}

#[derive(Clone, Debug, PartialEq)]
pub enum MesType {
    Num,
    Array,
    Object,
    String,
    Bool,
    Tree,
}

#[derive(Clone, Debug, PartialEq)]
pub struct Tree {
    pub tpe: TreeType,
    pub name: Key,
    pub params: Params,
    pub calls: Calls,
}

impl Tree {
    pub fn is_root(&self) -> bool {
        match self.tpe {
            TreeType::Root => true,
            _ => false
        }
    }
    pub fn new(tpe: TreeType, name: Key, params: Params, calls: Calls) -> Self {
        Self { tpe, name, params, calls }
    }
    pub fn to_inv(&self) -> Invocation {
        self.into()
    }
    pub fn to_inv_args(&self, args: Arguments) -> Invocation {
        Invocation::new(self, args)
    }
}

#[derive(Clone, Debug, PartialEq, Eq, Hash)]
pub struct Import(pub String, pub Vec<ImportName>);

#[derive(Clone, Debug, PartialEq, Hash, Eq)]
pub enum ImportName {
    Id(String),
    Alias(TreeName, AliasName),
    WholeFile,
}

impl ImportName {
    pub fn id(v: &str) -> Self {
        ImportName::Id(v.to_string())
    }
    pub fn alias(v: &str, alias: &str) -> Self {
        ImportName::Alias(v.to_string(), alias.to_string())
    }
}


impl Import {
    pub fn f_name(&self) -> &str {
        match self {
            Import(n, _) => n,
        }
    }
    pub fn file(f: &str) -> Self {
        Import(f.to_string(), vec![ImportName::WholeFile])
    }
    pub fn names(f: &str, names: Vec<&str>) -> Self {
        Import(
            f.to_string(),
            names.into_iter().map(|v| ImportName::id(v)).collect(),
        )
    }
    pub fn names_mixed(f: &str, names: Vec<ImportName>) -> Self {
        Import(
            f.to_string(),
            names,
        )
    }
}

#[derive(Clone, Debug, PartialEq)]
pub enum FileEntity {
    Tree(Tree),
    Import(Import),
}

#[derive(Clone, Debug, PartialEq)]
pub struct AstFile(pub Vec<FileEntity>);

impl<'a> AstFile {
    pub fn new(field0: Vec<FileEntity>) -> Self {
        Self(field0)
    }
}


#[cfg(test)]
mod tests {
    use std::str::FromStr;
    use crate::tree::parser::ast::TreeType;

    #[test]
    fn enum_test() {
        assert_eq!(
            TreeType::from_str("cond").unwrap(),
            TreeType::Cond
        );
        assert!(
            TreeType::from_str("bla").is_err()
        )
    }
}