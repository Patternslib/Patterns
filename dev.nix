{ }:

with import <nixpkgs> {};

buildEnv {
  name = "Patterns-env";
  paths = [
    phantomjs    
  ];
}