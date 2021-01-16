%predicate where the player chooses a certain row and column to play and calls the move predicate
makeMove(Player, State, NewState):-
	repeat,
		once(readColumn(NewColumn)),
		once(readRow(NewRow)),
		checkValid(NewRow, NewColumn, State),
	symbol(Player, S),
	move(State, [NewRow, NewColumn, S], NewState).

%updates the matrix with the new move and its repulsions
move(GameState, Move, NewGameState):-
	nth0(0, Move, NewRow),
	nth0(1, Move, NewColumn),
	nth0(2, Move, S),
	updateMove(GameState, NewRow, NewColumn, S, TempState),
	repulsions(NewRow, NewColumn, TempState, NewGameState).

%updateMove, playRow and playColumn are auxiliary predicates to change the value of the matrix in the position the player chose
updateMove(Board, Row, Col, Player, FinalBoard):-
	playRow(Row, Board, Col, Player, FinalBoard).
	
playRow(1, [Row|RestRow], Col, Player, [NewRow|RestRow]):-
	playColumn(Col, Row, Player, NewRow).
	
playRow(NRow, [Row|RestRow], C, Player, [Row|NewRow]):-
	NRow > 1,
	N is NRow - 1,
	playRow(N, RestRow, C, Player, NewRow).
	
playColumn(1, [_|RestColumn], Player, [Player|RestColumn]).

playColumn(NColumn, [Col|RestColumn], Player, [Col|NewColumn]):-
	NColumn > 1,
	N is NColumn - 1,
	playColumn(N, RestColumn, Player, NewColumn).


%gives NextPlayer its value according to the current player
changePlayer(Player, NextPlayer):-
	(
		(
			Player =:= 1,
		    NextPlayer is 2
		);
		(
			Player =:= 2,
			NextPlayer is 1
		)
	).


%checks if the move chosen was valid
checkValid(Row, Column, Board):-
	Row > 0,
	Column > 0,
	nth1(Row, Board, NewRow),
	nth1(Column, NewRow, Content),
	(
		Content == empty ->
		(
			true
		);
		(
			Content == 'Black' ->
			(
				write('Invalid position, square occupied by black.\n'),
				fail
			);
			(
				write('Invalid position, square occupied by red.\n'),
				fail
			)
		)
	).


%retrieves in Content the value of the matrix in position [Row][Column]
getContent(Row, Column, State, Content):-
	Row > 0,
	Column > 0,
	nth1(Row, State, NewRow),
	nth1(Column, NewRow, Content).



%%%%%%%%%%%%%% REPULSIONS %%%%%%%%%%%%%%



%checks if repulsions are necessary on the top left position
checkTopLeft(1, _, Board, UpdatedBoard):-
	UpdatedBoard = Board.

checkTopLeft(_, 1, Board, UpdatedBoard):-
	UpdatedBoard = Board.

checkTopLeft(Row, Col, Board, UpdatedBoard):-
	Row > 2,
	Col > 2,
	AuxRow is Row-1,
	AuxCol is Col-1,
	NextAuxRow is Row-2,
	NextAuxCol is Col-2,
	getContent(AuxRow, AuxCol, Board, Piece),
	getContent(NextAuxRow, NextAuxCol, Board, NextPiece),
	(
		(
			(Piece \= empty, NextPiece == empty) -> 
			(
				updateMove(Board, NextAuxRow, NextAuxCol, Piece, TempBoard),
				updateMove(TempBoard, AuxRow, AuxCol, empty, UpdatedBoard)
			)
		);
		UpdatedBoard = Board
	).

checkTopLeft(Row, Col, Board, UpdatedBoard):-
	Row > 1,
	Col > 1,
	AuxRow is Row-1,
	AuxCol is Col-1,
	updateMove(Board, AuxRow, AuxCol, empty, UpdatedBoard).


%checks if repulsions are necessary on the top position
checkTop(1, _, Board, UpdatedBoard):-
	UpdatedBoard = Board.

checkTop(Row, Col, Board, UpdatedBoard):-
	Row > 2,
	AuxRow is Row-1,
	NextAuxRow is Row-2,
	getContent(AuxRow, Col, Board, Piece),
	getContent(NextAuxRow, Col, Board, NextPiece),
	(
		(
			(Piece \= empty, NextPiece == empty) -> 
			(
				updateMove(Board, NextAuxRow, Col, Piece, TempBoard),
				updateMove(TempBoard, AuxRow, Col, empty, UpdatedBoard)
			)
		);
		UpdatedBoard = Board
	).

checkTop(Row, Col, Board, UpdatedBoard):-
	Row > 1,
	AuxRow is Row-1,
	updateMove(Board, AuxRow, Col, empty, UpdatedBoard).


%checks if repulsions are necessary on the top right position
checkTopRight(1, _, Board, UpdatedBoard):-
	UpdatedBoard = Board.

checkTopRight(_, 6, Board, UpdatedBoard):-
	UpdatedBoard = Board.

checkTopRight(Row, Col, Board, UpdatedBoard):-
	Row > 2,
	Col < 5,
	AuxRow is Row-1,
	AuxCol is Col+1,
	NextAuxRow is Row-2,
	NextAuxCol is Col+2,
	getContent(AuxRow, AuxCol, Board, Piece),
	getContent(NextAuxRow, NextAuxCol, Board, NextPiece),
	(
		(
			(Piece \= empty, NextPiece == empty) -> 
			(
				updateMove(Board, NextAuxRow, NextAuxCol, Piece, TempBoard),
				updateMove(TempBoard, AuxRow, AuxCol, empty, UpdatedBoard)
			)
		);
		UpdatedBoard = Board
	).

checkTopRight(Row, Col, Board, UpdatedBoard):-
	Row > 1,
	Col < 6,
	AuxRow is Row-1,
	AuxCol is Col+1,
	updateMove(Board, AuxRow, AuxCol, empty, UpdatedBoard).


%checks if repulsions are necessary on the right position
checkRight(_, 6, Board, UpdatedBoard):-
	UpdatedBoard = Board.

checkRight(Row, Col, Board, UpdatedBoard):-
	Col < 5,
	AuxCol is Col+1,
	NextAuxCol is Col+2,
	getContent(Row, AuxCol, Board, Piece),
	getContent(Row, NextAuxCol, Board, NextPiece),
	(
		(
			(Piece \= empty, NextPiece == empty) -> 
			(
				updateMove(Board, Row, NextAuxCol, Piece, TempBoard),
				updateMove(TempBoard, Row, AuxCol, empty, UpdatedBoard)
			)
		);
		UpdatedBoard = Board
	).

checkRight(Row, Col, Board, UpdatedBoard):-
	Col < 6,
	AuxCol is Col+1,
	updateMove(Board, Row, AuxCol, empty, UpdatedBoard).


%checks if repulsions are necessary on the left position
checkLeft(_, 1, Board, UpdatedBoard):-
	UpdatedBoard = Board.

checkLeft(Row, Col, Board, UpdatedBoard):-
	Col > 2,
	AuxCol is Col-1,
	NextAuxCol is Col-2,
	getContent(Row, AuxCol, Board, Piece),
	getContent(Row, NextAuxCol, Board, NextPiece),
	(
		(
			(Piece \= empty, NextPiece == empty) -> 
			(
				updateMove(Board, Row, NextAuxCol, Piece, TempBoard),
				updateMove(TempBoard, Row, AuxCol, empty, UpdatedBoard)
			)
		);
		UpdatedBoard = Board
	).

checkLeft(Row, Col, Board, UpdatedBoard):-
	Col > 1,
	AuxCol is Col-1,
	updateMove(Board, Row, AuxCol, empty, UpdatedBoard).


%checks if repulsions are necessary on the bottom left position
checkBottomLeft(6, _, Board, UpdatedBoard):-
	UpdatedBoard = Board.

checkBottomLeft(_, 1, Board, UpdatedBoard):-
	UpdatedBoard = Board.

checkBottomLeft(Row, Col, Board, UpdatedBoard):-
	Row < 5,
	Col > 2,
	AuxRow is Row+1,
	AuxCol is Col-1,
	NextAuxRow is Row+2,
	NextAuxCol is Col-2,
	getContent(AuxRow, AuxCol, Board, Piece),
	getContent(NextAuxRow, NextAuxCol, Board, NextPiece),
	(
		(
			(Piece \= empty, NextPiece == empty) -> 
			(
				updateMove(Board, NextAuxRow, NextAuxCol, Piece, TempBoard),
				updateMove(TempBoard, AuxRow, AuxCol, empty, UpdatedBoard)
			)
		);
		UpdatedBoard = Board
	).

checkBottomLeft(Row, Col, Board, UpdatedBoard):-
	Row < 6,
	Col > 1,
	AuxRow is Row+1,
	AuxCol is Col-1,
	updateMove(Board, AuxRow, AuxCol, empty, UpdatedBoard).


%checks if repulsions are necessary on the bottom position
checkBottom(6, _, Board, UpdatedBoard):-
	UpdatedBoard = Board.

checkBottom(Row, Col, Board, UpdatedBoard):-
	Row < 5,
	AuxRow is Row+1,
	NextAuxRow is Row+2,
	getContent(AuxRow, Col, Board, Piece),
	getContent(NextAuxRow, Col, Board, NextPiece),
	(
		(
			(Piece \= empty, NextPiece == empty) -> 
			(
				updateMove(Board, NextAuxRow, Col, Piece, TempBoard),
				updateMove(TempBoard, AuxRow, Col, empty, UpdatedBoard)
			)
		);
		UpdatedBoard = Board
	).

checkBottom(Row, Col, Board, UpdatedBoard):-
	Row < 6,
	AuxRow is Row+1,
	updateMove(Board, AuxRow, Col, empty, UpdatedBoard).


%checks if repulsions are necessary on the bottom right position
checkBottomRight(6, _, Board, UpdatedBoard):-
	UpdatedBoard = Board.

checkBottomRight(_, 6, Board, UpdatedBoard):-
	UpdatedBoard = Board.

checkBottomRight(Row, Col, Board, UpdatedBoard):-
	Row < 5,
	Col < 5,
	AuxRow is Row+1,
	AuxCol is Col+1,
	NextAuxRow is Row+2,
	NextAuxCol is Col+2,
	getContent(AuxRow, AuxCol, Board, Piece),
	getContent(NextAuxRow, NextAuxCol, Board, NextPiece),
	(
		(
			(Piece \= empty, NextPiece == empty) -> 
			(
				updateMove(Board, NextAuxRow, NextAuxCol, Piece, TempBoard),
				updateMove(TempBoard, AuxRow, AuxCol, empty, UpdatedBoard)
			)
		);
		UpdatedBoard = Board
	).

checkBottomRight(Row, Col, Board, UpdatedBoard):-
	Row < 6,
	Col < 6,
	AuxRow is Row+1,
	AuxCol is Col+1,
	updateMove(Board, AuxRow, AuxCol, empty, UpdatedBoard).


%predicate where all the repulsions are done
repulsions(Row, Column, TempState, NewState):-
	checkTopLeft(Row, Column, TempState, TempState1),
	checkTop(Row, Column, TempState1, TempState2),
	checkTopRight(Row, Column, TempState2, TempState3),
	checkRight(Row, Column, TempState3, TempState4),
	checkLeft(Row, Column, TempState4, TempState5),
	checkBottomLeft(Row, Column, TempState5, TempState6),
	checkBottom(Row, Column, TempState6, TempState7),
	checkBottomRight(Row, Column, TempState7, NewState).



%%%%%%%%%%%%%% CHECK GAME OVER %%%%%%%%%%%%%%



%CHECK 3 IN A ROW

%check 3 in a row on left diagonal
checkLeftDiag(_, _, _, _, 0).

checkLeftDiag(Row, Col, Board, Piece, No):-
	Row < 7,
	Col < 7,
	getContent(Row, Col, Board, Piece),
	NewRow is Row-1,
	NewCol is Col-1,
	Aux is No-1,
	checkLeftDiag(NewRow, NewCol, Board, Piece, Aux),
	!.

%check 3 in a row on right diagonal
checkRightDiag(_, _, _, _, 0).

checkRightDiag(Row, Col, Board, Piece, No):-
	Row < 7,
	Col < 7,
	getContent(Row, Col, Board, Piece),
	NewRow is Row-1,
	NewCol is Col+1,
	Aux is No-1,
	checkRightDiag(NewRow, NewCol, Board, Piece, Aux),
	!.

%check 3 in a row on column
checkCol(_, _, _, _, 0).

checkCol(Row, Col, Board, Piece, No):-
	Row < 7,
	Col < 7,
	getContent(Row, Col, Board, Piece),
	NewRow is Row-1,
	Aux is No-1,
	checkCol(NewRow, Col, Board, Piece, Aux),
	!.

%check 3 in a row on row
checkRow(_, _, _, _, 0).

checkRow(Row, Col, Board, Piece, No):-
	Row < 7,
	Col < 7,
	getContent(Row, Col, Board, Piece),
	NewCol is Col-1,
	Aux is No-1,
	checkRow(Row, NewCol, Board, Piece, Aux),
	!.


%checks if Piece has a 3 in a row on the board using auxiliary predicates
checkThree(Row, Col, Board, Piece):-
	Row > 0,
	Col > 0,
	checkLeftDiag(Row, Col, Board, Piece, 3);
	checkRightDiag(Row, Col, Board, Piece, 3);
	checkCol(Row, Col, Board, Piece, 3);
	checkRow(Row, Col, Board, Piece, 3).

checkThree(Row, Col, Board, Piece):-
	Row > 0,
	Col > 0,
	NewRow is Row-1,
	checkThree(NewRow, Col, Board, Piece).

checkThree(Row, Col, Board, Piece):-
	Row > 0,
	Col > 0,
	NewCol is Col-1,
	checkThree(Row, NewCol, Board, Piece).



%CHECK 8 PIECES

%checks if theres 8 ocurrences of Piece in the board
checkPieces(_, _, _, _, 0).

checkPieces(Row, Col, Piece, Board, No):-
	Row > 0,
	Col > 0,
	getContent(Row, Col, Board, Content),
	(
		(Content == Piece) -> 
			Aux is No-1;
			Aux is No
	),
	NewCol is Col-1,
	checkPieces(Row, NewCol, Piece, Board, Aux).

checkPieces(Row, Col, Piece, Board, No):-
	Col =< 0,
	NewCol is 6,
	NewRow is Row-1,
	checkPieces(NewRow, NewCol, Piece, Board, No).



%%%%%%%%%%%%%% INTELIGENCIA ARTIFICIAL %%%%%%%%%%%%%%



%chooses a random value from list List to ChosenList
choose([], []).

choose(List, ChosenList) :-
    length(List, Length),
    random(0, Length, Index),
    nth0(Index, List, ChosenList), !.

%creates a new position to be used in the validPos predicate
newPos(Row, Col, Row, Col).

newPos(Row, Col, FinalRow, FinalCol):-
	Col < 7,
	Row < 7,
	NewCol is Col + 1,
	newPos(Row, NewCol, FinalRow, FinalCol).

newPos(Row, Col, FinalRow, FinalCol):-
	Col >= 7,
	Row < 7,
	NewCol is 1,
	NewRow is Row + 1,
	newPos(NewRow, NewCol, FinalRow, FinalCol).

%checks if position is valid and if so, updates the boards matrix with its repulsions
validPos(Player, Row, Col, Board, NewBoard):-
	getContent(Row, Col, Board, empty),
	symbol(Player, S),
	updateMove(Board, Row, Col, S, TempState),
	repulsions(Row, Col, TempState, NewBoard),
	!.

%checks if a new position is valid, if so, its added to ListOfMoves
possible_move(Player, Board, Row, Col, UpdatedBoard):-
	newPos(1, 1,  Row, Col),
	validPos(Player, Row, Col, Board, UpdatedBoard).

%precidate that uses a findall to create a list with all the possible moves
valid_moves(GameState, Player, ListOfMoves):-
	findall([Row, Col, NewBoard], possible_move(Player, GameState, Row, Col, NewBoard), ListOfMoves).



%adds points to a players board according to how many pieces they have
pointsperPiecesOnBoard(_, 0, 6, _, FinalPoints, FinalPoints).

pointsperPiecesOnBoard(Board, Row, Column, Player, InicialPoints, FinalPoints):-
	Row > 0,
	Column =< 0,
	NewRow is Row-1,
    NewColumn is 6,
    pointsperPiecesOnBoard(Board, NewRow, NewColumn, Player, InicialPoints, FinalPoints).

pointsperPiecesOnBoard(Board, Row, Column, Player, InicialPoints, FinalPoints):-
	Row > 0,
    Column > 0,
    getContent(Row, Column, Board, Symbol),
    symbol(Player, ParsedSymbol),
    (
         Symbol == ParsedSymbol -> NewPoints is InicialPoints+1;
         NewPoints = InicialPoints
    ),
    NewColumn is Column-1,
    pointsperPiecesOnBoard(Board, Row, NewColumn, Player, NewPoints, FinalPoints).


%value retrieves all the points of the board for player Player
value(GameState, Player, Value):-
	symbol(Player,Symbol),
    (
        checkWin(GameState,Symbol), Points2 is 100
        ;
        Points2 is 0
    ),
    pointsperPiecesOnBoard(GameState, 6, 6, Player, 0, Points1),
    Value is Points1+Points2.


%predicate that selects the best boards
findBestBoards(_, [], FinalBestBoards, FinalBestBoards).

findBestBoards(HighScore, [H|T], BestBoards, FinalBestBoards):-
    nth0(3, H, BoardPoints),
    (
        HighScore < BoardPoints -> findBestBoards(BoardPoints, T, [H], FinalBestBoards);
        (
            HighScore =:= BoardPoints -> append(BestBoards, [H], NewBestBoards), findBestBoards(HighScore, T, NewBestBoards, FinalBestBoards);
			findBestBoards(HighScore, T, BestBoards, FinalBestBoards)
            
        )
    ).


%evaluates the board according to both players
allBoardsPoints([], FinalListOfBoards, _, FinalListOfBoards).

allBoardsPoints([H|T], ListBoards, Player, FinalListOfBoards):-
	changePlayer(Player, OtherPlayer),
	nth0(0, H, Row),
    nth0(1, H, Column),
    nth0(2, H, Board),
    value(Board, Player, PointsPlayer),
    value(Board, OtherPlayer, PointsOponnent),
	FinalBoardBalance is (PointsPlayer - PointsOponnent),
	append(ListBoards, [[Row, Column, Board, FinalBoardBalance]], NewListBoards),
	allBoardsPoints(T, NewListBoards, Player, FinalListOfBoards).


%finds the best move according to our evaluation of the board
findBestMove(ListBoards, Player,BestBoards):-
	allBoardsPoints(ListBoards, [], Player, BoardsScored),
	findBestBoards(-10, BoardsScored, [], BestBoards).
