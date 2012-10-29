/**
 * Dependency syntax grammer
 * Copyright 2012 Simplon B.V.
 *
 * This will return a simple AST for a dependency pattern. Each node in the AST
 * is object with the following keys:
 *
 * - type: node type. One of "comparison", "not", "and", or "or"
 *
 * If the type is "and" or "or" the following extra keys will be present:
 *
 * - leaves: only present if type is "comparison". list of leaf nodes
 *
 * If the type is "not" the following extra keys will be present:
 *
 * - child: the child node whose sense should be inverted
 *
 * If the type is "comparison" the following extra keys will be present:
 *
 * - operator: the comparison operator
 * - input: the name of the input element
 * - value: the value to compare against
 */

expression
    = node:simple_expression { return node; }
    / left:simple_expression __ type:logical __ right:expression {
        // See https://github.com/dmajda/pegjs/issues/116 for why we use a children list
        var children = [];
        children.push(left);
        children.push(right);
        return {type: type, leaves: children};
    }

simple_expression
    = "(" __ content:expression __ ")" { return content; }
    / input:identifier __ op:operator __ value:value {
        return {type: "comparison", operator: op, input: input, value: value};
    }
    / "not"i _ node:simple_expression {
        return {type: "not", child: node};
    }

operator "comparison operator"
  = "<="
  / "<"
  / "="
  / "!="
  / ">"
  / ">="

logical "logical operator"
  = "and"i
  / "or"i

identifier
  = [A-Za-z0-9._-]+

value
  = [A-Za-z0-9._-]+

_
  = (WhiteSpace)+ 

__ 
  = (WhiteSpace)*


WhiteSpace
  = [\t\v\f \u00A0\uFEFF]
  / Zs

Zs = [\u0020\u00A0\u1680\u180E\u2000\u2001\u2002\u2003\u2004\u2005\u2006\u2007\u2008\u2009\u200A\u202F\u205F\u3000]

