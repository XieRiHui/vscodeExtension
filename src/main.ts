interface FunctionNode{
    name:string;
    start:{
        line:number,
        column:number;
        index:number;
    };
    end:{
        line:number;
        column:number;
        index:number;
    }
}

import {parse} from "@babel/parser";
import traverse from "@babel/traverse";
export function getFunctionNode(code:string,index:number):FunctionNode| undefined{
    let functionNode;
    const ast=parse(code);
    traverse(ast,{
        FunctionDeclaration(path){
            if(index >= path.node?.start! && index<= path.node?.end!)
            {functionNode={
                name:path.node?.id?.name,
                start:path.node?.loc?.start,
                end:path.node?.loc?.end,
            };}
        }
    });
    return functionNode;
}