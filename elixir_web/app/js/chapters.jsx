import React from 'react'
import introduction from '../chapters/01_introduction.md'
import basic_types from '../chapters/02_basic_types.md'
import data_structures from '../chapters/03_data_structures.md'
import conditionals from '../chapters/04_conditionals.md'
import functions_modules from '../chapters/05_functions_modules.md'
import pattern_matching from '../chapters/06_pattern_matching.md'
import high_order_fun from '../chapters/07_high_order_functions.md'
import lazy_streams from '../chapters/08_lazy_streams.md'
import file_io from '../chapters/09_file_io.md'

import modules_structs from '../chapters/10_modules_structs.md'
import processes from '../chapters/11_processes.md'
import process_abstractions from '../chapters/12_supervisors_and_otp.md'
import composing_an_application from '../chapters/13_composing_an_application.md'
import language_tools from '../chapters/14_mix_hex_docs.md'
import drafts_and_ideas from '../chapters/drafts_and_ideas.md'

const raw_chapters = [{
  title: "Introduction",
  done: "70%",
  path: "/introduction",
  content: introduction
},
{
  title: "Basic types",
  done: "100%",
  path: "/basic_types",
  content: basic_types
},
{
  title: "Data structures",
  done: "80%",
  path: "/data_structures",
  content: data_structures
},
{
  title: "Conditional structures",
  done: "95%",
  path: "/conditionals",
  content: conditionals
},
{
  title: "Functions and modules",
  done: "90%",
  path: "/functions_modules",
  content: functions_modules
},
{
  title: "Pattern matching",
  done: "70%",
  path: "/pattern_matching",
  content: pattern_matching
},
{
  title: "High-order functions",
  done: "90%",
  path: "/high_order_fun",
  content: high_order_fun
},
{
  title: "Lazy evaluation and streams",
  done: "80%",
  path: "/lazy_streams",
  content: lazy_streams
},
{
  title: "Hello outside world! Input and output",
  done: "75%",
  path: "/file_io",
  content: file_io
},
{
  title: "Modules and structs",
  done: "60%",
  path: "/modules_structs",
  content: modules_structs
},
{
  title: "Parallelism with processes",
  done: "90%",
  path: "/processes",
  content: processes
},
{
  title: "Supervisors and process abstractions",
  done: "5%",
  path: "/supervisors_abstractions",
  content: process_abstractions
},
{
  title: "Language tools",
  done: "40%",
  path: "/language_tools",
  content: language_tools
},
{
  title: "Composing an application",
  done: "50%",
  path: "/composing_an_application",
  content: composing_an_application
},
{
  title: "Drafts and ideas",
  done: "50%",
  path: "/drafts",
  content: drafts_and_ideas
}];

let numbered = raw_chapters.map(function (chapter, i) {
  return Object.assign({}, chapter, {
    number: i + 1
  })
});

export function prevChapter(current) {
  if (current.number < 2) {
    return [];
  } else {
    return [numbered[current.number - 2]];
  }
}

export function nextChapter(current) {
  if (current.number == numbered.length) {
    return [];
  }
  return [numbered[current.number]];
}

export const chapters = numbered;
