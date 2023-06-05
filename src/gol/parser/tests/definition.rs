use std::collections::HashMap;
use parsit::error::ParseError;
use parsit::test::parser_test::*;
use crate::gol::ast::*;
use crate::gol::parser::Parser;

#[test]
fn definition() {
    let parser = Parser::new(r#"root name {}"#).unwrap();
    expect(parser.tree(0), Tree::new(
        TreeType::Root,
        Id("name".to_string()),
        Params::default(),
        Calls::default(),
    ));

    let parser = Parser::new(r#"fallback name() {}"#).unwrap();
    expect(parser.tree(0), Tree::new(
        TreeType::Fallback,
        Id("name".to_string()),
        Params::default(),
        Calls::default(),
    ));
    let parser = Parser::new(r#"sequence name(a:string,b:num) {}"#).unwrap();
    expect(parser.tree(0), Tree::new(
        TreeType::Sequence,
        Id("name".to_string()),
        Params::new(vec![Param::new("a", MesType::String), Param::new("b", MesType::Num)]),
        Calls::default(),
    ));

    let parser = Parser::new(r#"
    sequence name(a:string,b:num) {
        fallback { action1() repeat(x = 1) action2() }
        action3()
    }"#).unwrap();
    expect(parser.tree(0), Tree::new(
        TreeType::Sequence,
        Id("name".to_string()),
        Params::new(vec![Param::new("a", MesType::String), Param::new("b", MesType::Num)]),
        Calls::new(vec![
            Call::lambda(TreeType::Fallback, Calls::new(vec![
                Call::invocation("action1", Arguments::default()),
                Call::decorator(TreeType::Repeat,
                                Arguments::new(vec![Argument::id_mes("x", Message::Num(Number::Int(1)))]),
                                Call::invocation("action2", Arguments::default())),
            ])),
            Call::invocation("action3", Arguments::default()),
        ]),
    ));
}

#[test]
fn short_definition() {
    let parser = Parser::new(r#"
    root ball fallback {
        try_to_place_to(ball,bin) // the objects in bb that denote ball and bin
        ask_for_help()
}
    "#).unwrap();
    expect(parser.tree(0), Tree::new(
        TreeType::Root,
        Id("ball".to_string()),
        Params::default(),
        Calls::new(vec![
            Call::lambda(TreeType::Fallback,Calls::new(vec![
                Call::invocation("try_to_place_to",Arguments::new(vec![
                    Argument::id("ball"),
                    Argument::id("bin"),
                ])),
                Call::invocation("ask_for_help",Arguments::default())
            ])),

        ]),
    ));

}

#[test]
fn impl_definition() {
    let parser = Parser::new(r#"
        cond grasped(obj:object)
    "#).unwrap();
    expect(parser.tree(0), Tree::new(
        TreeType::Cond,
        Id("grasped".to_string()),
        Params::new(vec![Param::new("obj",MesType::Object)]),
        Calls::default()
    ));

}


