%predicate to choose the next moves row
readRow(NextRow):-
	write('Choose a row:\n'),
	read(Row),
	checkRow(Row, NextRow).

%predicate to choose the next moves column
readColumn(NextColumn):-
	write('Choose a column:\n'),
	read(Column),
	checkColumn(Column, NextColumn).
	

%checkRow, checkColumn, checkOption and checkOption2 -> series of verification predicates
checkRow(1, 1).

checkRow(2, 2).

checkRow(3, 3).

checkRow(4, 4).

checkRow(5, 5).

checkRow(6, 6).

checkRow(_, NextRow):-
	write('Invalid row! Select again!\n'),
	readRow(NextRow).



checkColumn('A', 1).
checkColumn(a, 1).
	
checkColumn('B', 2).
checkColumn(b, 2).
	
checkColumn('C', 3).
checkColumn(c, 3).
	
checkColumn('D', 4).
checkColumn(d, 4).
	
checkColumn('E', 5).
checkColumn(e, 5).
	
checkColumn('F', 6).
checkColumn(f, 6).

checkColumn(_, NextColumn):-
	write('Invalid column! Select again!\n'),
	readColumn(NextColumn).

checkOption(MenuChoice):-
	MenuChoice >= 0,
	MenuChoice =< 3.

checkOption(_):-
	write('Invalid option! Select again!\n').

checkOption2(MenuChoice):-
	MenuChoice >= 0,
	MenuChoice =< 2.

checkOption2(_):-
	write('Invalid option! Select again!\n').
