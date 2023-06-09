pub mod file;
pub mod imports;

use crate::read_file;
use crate::runtime::action::ActionName;
use crate::runtime::builder::BuilderBuiltInActions;
use crate::runtime::RtResult;
use crate::tree::parser::ast::{AstFile, FileEntity, Import, ImportName, Key, Tree};
use crate::tree::parser::Parser;
use crate::tree::project::file::File;
use crate::tree::{cerr, TreeError};
use itertools::Itertools;
use parsit::error::ParseError;
use std::borrow::Cow;
use std::collections::{HashMap, HashSet};
use std::fs;
use std::iter::Map;
use std::path::{Path, PathBuf};

pub type FileName = String;
pub type TreeName = String;
pub type AliasName = String;

/// the base structure represents the folder on the disk with some auxiliary info
/// ## Structure
///   - `root` is a root of the project. Every import relates to it.
///   - `main` is a pointer to the file and definition when the tree is started.
///   - `files` is a map of the files
#[derive(Debug, Default, Clone)]
pub struct Project {
    pub root: PathBuf,
    pub main: (FileName, TreeName),
    pub files: HashMap<FileName, File>,
    pub std: HashSet<ActionName>,
}

impl<'a> Project {
    pub fn find_file(&'a self, f_name: &str) -> Result<&'a File, TreeError> {
        self.files.get(f_name).ok_or(cerr(format!(
            "unexpected error: the file {f_name} not exists"
        )))
    }
    pub fn find_root(&'a self, name: &TreeName, file: &FileName) -> Result<&'a Tree, TreeError> {
        self.find_file(file)?
            .definitions
            .get(name)
            .ok_or(cerr(format!("no root {name} in {file}")))
    }

    pub fn find_tree(&self, file: &FileName, tree: &TreeName) -> Option<&Tree> {
        self.files.get(file).and_then(|f| f.definitions.get(tree))
    }

    pub fn build_with_root(
        main_file: FileName,
        main_call: TreeName,
        root: PathBuf,
    ) -> Result<Project, TreeError> {
        let mut project = Project {
            root: root.clone(),
            main: ("".to_string(), "".to_string()),
            files: Default::default(),
            std: Default::default(),
        };
        project.main = (main_file.clone(), main_call);
        let _ = project.parse_file(root.clone(), main_file.clone())?;
        Ok(project)
    }
    pub fn build(main_file: FileName, root: PathBuf) -> Result<Project, TreeError> {
        let mut project = Project {
            root: root.clone(),
            main: ("".to_string(), "".to_string()),
            files: Default::default(),
            std: Default::default(),
        };

        let _ = project.parse_file(root.clone(), main_file.clone())?;

        let main_call = project
            .files
            .get(main_file.as_str())
            .and_then(|file| file.definitions.iter().find(|(name, t)| t.is_root()))
            .map(|(name, _)| name.to_string())
            .ok_or(TreeError::IOError(format!(
                "no root operation in the file {}",
                main_file.clone()
            )))?;
        project.main = (main_file, main_call);
        Ok(project)
    }

    fn parse_file(&mut self, mut root: PathBuf, file: FileName) -> Result<(), TreeError> {
        let text = file_to_str(root.clone(), file.clone())?;
        let ast_file = Parser::new(text.as_str())?.parse()?;

        if !self.files.contains_key(file.as_str()) {
            let mut file = File::new(file.clone());

            for ent in ast_file.0.into_iter() {
                let _ = match ent {
                    FileEntity::Tree(t) => file.add_def(t)?,
                    FileEntity::Import(i) => {
                        let _ = self.parse_file(root.clone(), i.f_name().to_string())?;
                        file.add_import(i)?
                    }
                };
            }

            self.files.insert(file.name.clone(), file);
        }
        Ok(())
    }
}
fn file_to_str<'a>(root: PathBuf, file: FileName) -> Result<String, TreeError> {
    if file == "std::actions" {
        Ok(BuilderBuiltInActions::builtin_actions_file())
    } else {
        let mut path = root;
        path.push(file.clone());
        Ok(read_file(&path)?)
    }
}
