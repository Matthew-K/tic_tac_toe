/* Model 
==============================*/
var model = {

	avatar: {
		user: 'X',
		ai: "O"
	},

	board: {
		topLeft: "",
		topMiddle: "",
		topRight: "",
		middleLeft: "",
		middleMiddle: "",
		middleRight: "",
		bottomLeft: "",
		bottomMiddle: "",
		bottomRight: "",
	},

	winner: false

};



/* Controller 
==============================*/
var controller = {

	init: function(){
		view.init();
	},

	setAvatars: function(user, ai){
		model.avatar.user = user;
		model.avatar.ai = ai;
	},

	updateBox: function(box, userOrAI){
		model.board[box] = controller.getAvatar(userOrAI);
	},

	getBox: function(box){
		return model.board[box];
	},

	getAvatar: function(userOrAI){
		if(userOrAI === 'user'){
			return model.avatar.user;
		} else if(userOrAI === 'ai'){
			return model.avatar.ai;
		}
	},

	isWinner: function(){
		return model.winner;
	},

	updateWinner: function(boolean){
		model.winner = boolean;
	},

	getBoard: function(){
		return model.board;
	},

	checkForWinner: function(XorO){
		var board = controller.getBoard();

		// Easier to visualize board
		board = [
			[ board.topLeft,    board.topMiddle,    board.topRight    ],
			[ board.middleLeft, board.middleMiddle, board.middleRight ],
			[ board.bottomLeft, board.bottomMiddle, board.bottomRight ]
		];
		// topLeft: "",
		// topMiddle: "",
		// topRight: "",
		// middleLeft: "",
		// middleMiddle: "",
		// middleRight: "",
		// bottomLeft: "",
		// bottomMiddle: "",
		// bottomRight: "",
		winningRows = 	[	// horizontal rows
							[board[0][0], board[0][1], board[0][2]],
							[board[1][0], board[1][1], board[1][2]],
							[board[2][0], board[2][1], board[2][2]],

							// vertical rows
							[board[0][0], board[1][0], board[2][0]],
							[board[0][1], board[1][1], board[2][1]],
							[board[0][2], board[1][2], board[2][2]],

							// diagonal rows
							[board[0][0], board[1][1], board[2][2]],
							[board[0][2], board[1][1], board[2][0]]
						];

		var avatar = XorO; 
		var winner = controller.isWinner(); // Value should be false before checking for winning rows

		// Check if any possible winning rows contain three in a row of avatar's value
		for(var i = 0; i < winningRows.length; i++){
			for(var j = 0; j < winningRows[i].length; j++){
				if(winningRows[i][j] !== avatar){
					winner = false;
					break;
				} else {
					winner = true;
				}
			}
			if(winner === true){
				winner = true;
				controller.updateWinner(true);
				break;
			}
		}

		var winnerIs = '';
		if(winner){
			var avatars = model.avatar;
			// Check to see if avatar belongs to user or computer(ai);
			if(avatar === avatars.user){
				winnerIs = "user";
			} else if(avatar === avatars.ai){
				winnerIs = "ai";
			}	
			return controller.endGame(winnerIs);
		// Else if there is a tie	
		} else if (controller.checkTie()){
			return controller.endGame('tie');
		}

	},

	checkTie: function(){
		var board = controller.getBoard();
		// Check if any boxes are left
		for (var key in board){
			if(board[key] === ""){
				return false;
			}
		// If not, return true (there is a tie)
		}
		return true;
	},

	endGame: function(winnerOrTie){
		view.cantClick();
		view.showWinner(winnerOrTie);
	},

	resetData: function(){
		// controller.setAvatars("","");
		controller.updateWinner(false);
		model.board =  {
			topLeft: "",
			topMiddle: "",
			topRight: "",
			middleLeft: "",
			middleMiddle: "",
			middleRight: "",
			bottomLeft: "",
			bottomMiddle: "",
			bottomRight: "",
		};
	},

	aiChoice: function(){
		var board = controller.getBoard();

		// Easier to visualize board
		board2 = [
			[ board.topLeft,    board.topMiddle,    board.topRight    ],
			[ board.middleLeft, board.middleMiddle, board.middleRight ],
			[ board.bottomLeft, board.bottomMiddle, board.bottomRight ]
		];

		var strings = 	[	// horizontal rows
							['topLeft', 	'topMiddle', 	'topRight'],
							['middleLeft', 	'middleMiddle', 'middleRight'],
							['bottomLeft', 	'bottomMiddle', 'bottomRight'],

							// vertical rows
							['topLeft', 	'middleLeft', 	'bottomLeft'],
							['topMiddle', 	'middleMiddle', 'bottomMiddle'],
							['topRight', 	'middleRight', 	'bottomRight'],

							// diagonal rows
							['topLeft', 	'middleMiddle', 'bottomRight'],
							['topRight', 	'middleMiddle', 'bottomLeft']
						];

		var winningRows = 	[	// horizontal rows
							[board2[0][0], board2[0][1], board2[0][2]],
							[board2[1][0], board2[1][1], board2[1][2]],
							[board2[2][0], board2[2][1], board2[2][2]],

							// vertical rows
							[board2[0][0], board2[1][0], board2[2][0]],
							[board2[0][1], board2[1][1], board2[2][1]],
							[board2[0][2], board2[1][2], board2[2][2]],

							// diagonal rows
							[board2[0][0], board2[1][1], board2[2][2]],
							[board2[0][2], board2[1][1], board2[2][0]]
						];

		var userAvatar = controller.getAvatar('user'); 
		var aiAvatar = controller.getAvatar('ai');
		var box = '';

		// Check if any possible winning rows contain three in a row of avatar's value
		for(var i = 0; i < winningRows.length; i++){
			var inARow = 0;
			for(var j = 0; j < winningRows[i].length; j++){
				if(winningRows[i][j] !== userAvatar){
				} else {
					inARow ++;
				}
			}
			if(inARow === 2){		
				var winningRow = winningRows[i];
				var winningStrings = strings[i];

				for(var n = 0; n < winningRow.length; n++){
					if(winningRow[n] === ''){
						box = winningStrings[n];
						controller.updateBox(box, "ai");
						//seperate into view
						$("#" + box).html("<span class='greenText'>" + aiAvatar + "</span>");
						controller.checkForWinner(aiAvatar);
						return;
					}
				}
			} else {
				inARow = 0;
			}
		}

		// RANDOM CHOICE
		//==========================
		var options = [];
		for(var key in board){
			if(board[key] === ""){
				options.push(key);
			}
		}
		var length = options.length;
		box = Math.floor((Math.random() * length));
		// box will be a number 0 through (options.length -1)
		box = options[box];
		controller.updateBox(box, "ai");
		var avatar = controller.getAvatar("ai");
		$("#" + box).html("<span class='greenText'>" + avatar + "</span>");
		controller.checkForWinner(avatar);

	},

};



/* View 
==============================*/

var view = {

	init: function(){
		// $('#avatarChoice').modal('show');
		// view.chooseAvatar();
		view.boxClick();
	},

	chooseAvatar: function(){
		view.avatarX();
		view.avatarO();
	},

	// Click handler for avatar choice when app first initialized
	avatarX: function(){
		$("#avatarX").on("click", function(){
			controller.setAvatars('X', 'O');
			$('#avatarChoice').modal('hide');
		});
	},

	// Click handler for avatar choice when app first initialized
	avatarO: function(){
		$("#avatarO").on("click", function(){
			controller.setAvatars('O', 'X');
			$('#avatarChoice').modal('hide');
		});
	},

	// Click handler for clicking on boxes when user's turn
	boxClick: function(){
		$(".box").on("click", function(){
			var box = $(this).attr('id');
			// If box is already filled, return
			if(controller.getBox(box) !== ""){
				return;
			} else {
				controller.updateBox(box, 'user');
				var avatar = controller.getAvatar('user');
				$(this).text(avatar);
				controller.checkForWinner(avatar);
				if(controller.isWinner() === false){
					controller.aiChoice();
				}
			}
		});
	},

	// Disable user's ability to click on boxes
	cantClick: function(){
		$(".box").off("click");
	},

	showWinner: function(winner){
		if(winner === 'user'){
			$('#userWins').modal('show');
			// Clear board when modal is closed and restart game
			$("#userWins").on('hide.bs.modal', function () {
            	$(".box").text("");
            	controller.resetData();
            	view.gameStart('ai');
    		});
		} else if(winner === "ai"){
			$('#aiWins').modal('show');
			// Clear board when modal is closed and restart game
			$("#aiWins").on('hide.bs.modal', function () {
            	$(".box").text("");
            	controller.resetData();
            	view.gameStart('user');
    		});
		} else{
			$('#tie').modal('show');
			// Clear board when modal is closed and restart game
			$("#tie").on('hide.bs.modal', function () {
            	$(".box").text("");
            	controller.resetData();
            	view.gameStart('user');
    		});
		}
	},

	// Input is who will start a match, 'user' or 'ai'
	gameStart: function(userOrAI){
		if (userOrAI === "user"){
			view.boxClick();
		} else if (userOrAI === "ai"){
			controller.aiChoice();
			view.boxClick();
		}
	}

};


// Run at start
controller.init();