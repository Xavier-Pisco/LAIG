:- consult('play.pl').
:- consult('display.pl').
:- consult('input.pl').
:- consult('utils.pl').
:- consult('menu.pl').

:-use_module(library(lists)).
:-use_module(library(random)).
:-use_module(library(system)).

%main function
play:-
	start.
