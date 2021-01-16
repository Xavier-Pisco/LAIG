:-dynamic(state/2).

%creates the initial board
initial(GameState):-
    initialBoard(GameState).

%predicate used to print the board as well as the current player's turn
display_game(Player, GameState):-
	printBoard(GameState),
	symbol(Player, S),
	write(S),
	write(' ('),
	symbol(S, Str),
	write(Str),
	write(') To Play:'), nl.

repeat.
repeat:-
    repeat.


%Main game loops -> displays the board, calls player to move a piece and evaluates if a player has won, if so, calls endGame

%player v player game loop
game_loop('P1', 'P2'):-
	initial(GameState),
    assert(state(1, GameState)),
    repeat,
		retract(state(Player, Board)),
		once(display_game(Player, Board)),
		once(playPiece(Player, Board, NewBoard)),
		once(changePlayer(Player, NextPlayer)),
		assert(state(NextPlayer, NewBoard)),
		game_over(NewBoard, Winner),
	printBoard(NewBoard),
	retract(state(_,_)),
	endGame(Winner).

%player vs easy ai loop
game_loop_pvc_easy('P1', 'AI1'):-
	initial(GameState),
    assert(state(1, GameState)),
    repeat,
    	retract(state(Player, Board)),
		once(display_game(Player, Board)),
		(
			Player =:= 2, once(choose_move(Board, Player, 1, NewBoard))
			;
			Player =:= 1, once(playPiece(Player, Board, NewBoard))
		),
		once(changePlayer(Player, NextPlayer)),
		assert(state(NextPlayer, NewBoard)),
		game_over(NewBoard, Winner),
	printBoard(NewBoard),
	retract(state(_,_)),
	endGame(Winner).

%player vs hard ai loop
game_loop_pvc_hard('P1', 'AI2'):-
	initial(GameState),
    assert(state(1, GameState)),
    repeat,
    	retract(state(Player, Board)),
		once(display_game(Player, Board)),
		(
			Player =:= 2, once(choose_move(Board, Player, 2, NewBoard))
			;
			Player =:= 1, once(playPiece(Player, Board, NewBoard))
		),
		once(changePlayer(Player, NextPlayer)),
		assert(state(NextPlayer, NewBoard)),
		game_over(NewBoard, Winner),
	printBoard(NewBoard),
	retract(state(_,_)),
	endGame(Winner).

%computer vs computer in easy mode
game_loop_cvc_easy('AI1', 'AI1'):-
	initial(GameState),
    assert(state(1, GameState)),
    repeat,
		retract(state(Player, Board)),
		once(display_game(Player, Board)),
		once(choose_move(Board, Player, 1, NewBoard)),
		once(changePlayer(Player, NextPlayer)),
		assert(state(NextPlayer, NewBoard)),
		sleep(1),
		game_over(NewBoard, Winner),
	printBoard(NewBoard),
	retract(state(_,_)),
	endGame(Winner).

%computer vs computer in hard mode
game_loop_cvc_hard('AI2', 'AI2'):-
	initial(GameState),
    assert(state(1, GameState)),
    repeat,
		retract(state(Player, Board)),
		once(display_game(Player, Board)),
		once(choose_move(Board, Player, 2, NewBoard)),
		once(changePlayer(Player, NextPlayer)),
		assert(state(NextPlayer, NewBoard)),
		sleep(1),
		game_over(NewBoard, Winner),
	printBoard(NewBoard),
	retract(state(_,_)),
	endGame(Winner).


%choose_move -> predicate where the computer chooses its move based on the current difficulty and plays it

%chooses and plays a random valid position for the next move
choose_move(GameState, Player, 1, Move):- %Move = UpdatedBoard
	valid_moves(GameState, Player, ListBoards),
	choose(ListBoards, Move),
	nth0(0, Move, NewRow),
	nth0(1, Move, NewCol),
	printPCmove(NewRow, NewCol).

%chooses and plays the best move according to our evaluation of the board
choose_move(GameState, Player, 2, Move):- %Move = UpdatedBoard
	valid_moves(GameState, Player, ListBoards),
	findBestMove(ListBoards, Player, BestBoards),
	choose(BestBoards, Move),
	nth0(0, Move, NewRow),
	nth0(1, Move, NewCol),
	printPCmove(NewRow, NewCol).

%prints move played by the computer
printPCmove(NewRow, NewCol):-
	checkColumn(X, NewCol),
	write('PC played the move: '), write(X), write(NewRow), nl.

%predicate where the player chooses its next move
playPiece(Player, Board, UpdatedBoard):-
	makeMove(Player, Board, UpdatedBoard).


%checks if player Player won the game
checkWin(Board, Player):-
	checkPieces(6, 6, Player, Board, 8);
	checkThree(7, 7, Board, Player).

%checks if the game is over, eg someone won
game_over(Board, Winner):-
	(
		checkWin(Board, 'Black'),
		Winner is 1
	);
	(
		checkWin(Board, 'Red'),
		Winner is 2
	);
	Winner is 0.


%ends the current loop, declaring the winner
endGame(Winner):-
	symbol(Winner, Player),
	write(Player),
	write(' wins the game!!!!\n'),
	write('_____________________________________________________________________       '),nl,nl,nl.
