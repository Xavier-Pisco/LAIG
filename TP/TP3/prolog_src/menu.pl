%displays the initial menu and calls predicate to read input
start:-
	showMenu,
	readMenuChoice.

showMenu:-
	write('        -----   -----  |     }  -------  -------   ------   -------      '),nl,
	write('       |       |       |    }      |        |     |      |     |         '),nl,
	write('       |       |       |   }       |        |     |      |     |         '),nl,
	write('       |-----  |-----  | ---       |        |     | ____ |     |         '),nl,
	write('       |     | |       |   l       |        |     |      |     |         '),nl,
	write('       |     | |       |    l      |        |     |      |     |         '),nl,
	write('        -----   -----  |     l  -------     |     |      |  -------      '),nl,
	write('       ------------------------------------------------------------      '),nl,nl,
	write('        ----------------------------------------------------------       '),nl,
	write('       |                                                          |      '),nl,
	write('       |                                                          |      '),nl,
	write('       |                                                          |      '),nl,
	write('       |            1. PvP --------> Player vs Player             |      '),nl,
	write('       |                                                          |      '),nl,
	write('       |            2. PvC ------> Player vs Computer             |      '),nl,
	write('       |                                                          |      '),nl,
	write('       |            3. CvC ----> Computer vs Computer             |      '),nl,
	write('       |                                                          |      '),nl,
	write('       |            0. Exit --------------> Terminate             |      '),nl,
	write('       |                                                          |      '),nl,
	write('       |                                                          |      '),nl,
	write('        ----------------------------------------------------------       '),nl,
	write('        Chose an Option:                                                 '),nl,
	write('        ----------------------------------------------------------       '),nl.

showMenu2:-
	write('        -----   -----  |     }  -------  -------   ------   -------      '),nl,
	write('       |       |       |    }      |        |     |      |     |         '),nl,
	write('       |       |       |   }       |        |     |      |     |         '),nl,
	write('       |-----  |-----  | ---       |        |     | ____ |     |         '),nl,
	write('       |     | |       |   l       |        |     |      |     |         '),nl,
	write('       |     | |       |    l      |        |     |      |     |         '),nl,
	write('        -----   -----  |     l  -------     |     |      |  -------      '),nl,
	write('       ------------------------------------------------------------      '),nl,nl,
	write('        ----------------------------------------------------------       '),nl,
	write('       |                                                          |      '),nl,
	write('       |                                                          |      '),nl,
	write('       |                                                          |      '),nl,
	write('       |                                                          |      '),nl,
	write('       |                       1. Easy                            |      '),nl,
	write('       |                                                          |      '),nl,
	write('       |                       2. Hard                            |      '),nl,
	write('       |                                                          |      '),nl,
	write('       |                       0. Return                          |      '),nl,
	write('       |                                                          |      '),nl,
	write('       |                                                          |      '),nl,
	write('       |                                                          |      '),nl,
	write('       |                                                          |      '),nl,
	write('        ----------------------------------------------------------       '),nl,
	write('        Chose an Option:                                                 '),nl,
	write('        ----------------------------------------------------------       '),nl.

%reads option and checks if valid
readMenuChoice:-
	repeat,
		read(MenuChoice),
		checkOption(MenuChoice),
	makeOption(MenuChoice).

%exits the program
makeOption(0):-
	write('\nClosing Game...\n\n').

%starts player v player game
makeOption(1):-
	game_loop('P1', 'P2'),
	sleep(1),
	start.

%prints 2nd menu, reads option, checks if its a valid one and calls predicate for player v computer setup
makeOption(2):-
	showMenu2,
	repeat,
		read(MenuChoice),
		checkOption2(MenuChoice),
	makeOptionPvC(MenuChoice).

%prints 2nd menu, reads option, checks if its a valid one and calls predicate for computer v computer setup
makeOption(3):-
	showMenu2,
	repeat,
		read(MenuChoice),
		checkOption2(MenuChoice),
	makeOptionCvC(MenuChoice).

%goes back to main menu
makeOptionPvC(0):-
	write('\nGoing back...\n\n'),
	start.

%starts player v computer game in the easy difficulty
makeOptionPvC(1):-
	game_loop_pvc_easy('P1', 'AI1'),
	sleep(1),
	start.

%starts player v computer game in the hard difficulty
makeOptionPvC(2):-
	game_loop_pvc_hard('P1', 'AI2'),
	sleep(1),
	start.

%goes back to main menu
makeOptionCvC(0):-
	write('\nGoing back...\n\n'),
	start.

%starts computer v computer game in the easy difficulty
makeOptionCvC(1):-
	game_loop_cvc_easy('AI1', 'AI1'),
	sleep(1),
	start.

%starts computer v computer game in the hard difficulty
makeOptionCvC(2):-
	game_loop_cvc_hard('AI2', 'AI2'),
	sleep(1),
	start.
