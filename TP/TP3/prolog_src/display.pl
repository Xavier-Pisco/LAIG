initialBoard([
[empty, empty, empty, empty, empty, empty],
[empty, empty, empty, empty, empty, empty],
[empty, empty, empty, empty, empty, empty],
[empty, empty, empty, empty, empty, empty],
[empty, empty, empty, empty, empty, empty],
[empty, empty, empty, empty, empty, empty]
]).

/*
IntermediateBoard([
['Black', 'Black', empty, empty, empty, empty],
[empty, empty, empty, empty, empty, empty],
[empty, empty, 'Red', empty, empty, empty],
[empty, empty, empty, empty, empty, empty],
[empty, empty, empty, empty, empty, empty],
[empty, empty, empty, empty, empty, empty]
]).
*/

/*
FinalBoard([
['Black', 'Black', 'Black', empty, empty, empty],
['Red', 'Red', empty, empty, empty, empty],
[empty, empty, 'Red', empty, empty, empty],
[empty, empty, empty, 'Black', empty, empty],
[empty, empty, empty, empty, empty, empty],
[empty, empty, empty, empty, empty, empty]
]).
*/


%predicates that replaces different values
symbol(empty, S):- S= ' '.
symbol(1, S):- S= 'Black'.
symbol(2, S):- S= 'Red'.
symbol('Black', S):- S= 'X'.
symbol('Red', S):- S= 'O'.

/*Since the game itself doesn't have square notation, we decided to adopt the chess notation, meaning that rows are designated by numbers and columns by letters, from left to right and bottom to top*/
%predicate that calls printMatrix and starts printing the board
printBoard(X):-
    nl,
    write('   | A | B | C | D | E | F |\n'),
    write('---|---|---|---|---|---|---|\n'),
    printMatrix(X, 1).

%prints the current game matrix in a board-like way
printMatrix([], 7).
printMatrix([H|T], X):-
    write(' '),
    write(X),
    write(' | '),
    X1 is X + 1,
    printLine(H),
    nl,
    write('---|---|---|---|---|---|---|\n'),
    printMatrix(T, X1).

%prints a matrixs line
printLine([]).
printLine([H|T]):-
    symbol(H, S),
    write(S),
    write(' | '),
    printLine(T).
