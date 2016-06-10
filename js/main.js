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
		console.log(model.board);
		// console.log(model.);
		var board = controller.getBoard();
		board = [
			[ board.topLeft,    board.topMiddle,    board.topRight    ],
			[ board.middleLeft, board.middleMiddle, board.middleRight ],
			[ board.bottomLeft, board.bottomMiddle, board.bottomRight ]
		];

		var check = XorO; 
		var winner = controller.isWinner(); // Value should be false before checking rows, columns, and diagonals for 3 in a row

		if(!winner){
			// Check horizontal rows for 3 matches
			for(var i = 0; i < board.length; i++){
				for (var b = 0; b < board[i].length; b++){
					if(board[i][b] !== check){
						winner = false;
						break;
					}
					winner = true;
				}
				if(winner === true){
					controller.updateWinner(true);
					break;
				}
			}
		}
		if(!winner){
			// Check vertical columns for 3 matches
			for(var j = 0; j < board.length; j++){
				for (var k = 0; k < board[j].length; k++){
					if(board[k][j] !== check){
						winner = false;
						break;
					}
					winner = true;
				}
				if(winner === true){
					controller.updateWinner(true);
					break;
				}
			}
		}
		if(!winner){
			// Check diagonals for 3 matches		
			if(board[0][0] === check && board[1][1] === check && board[2][2] ===check){
				winner = true;
				controller.updateWinner(true);
			} else if(board[0][2] === check && board[1][1] === check && board[2][0] === check){
				winner = true;
				controller.updateWinner(true);
			}
		}
		var winnerIs = '';
		if(winner){
			var avatars = model.avatar;
			if(check === avatars.user){
				winnerIs = "user";
			} else if(check === avatars.ai){
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
	}

};



/* View 
==============================*/

var view = {

	init: function(){
		$('#avatarChoice').modal('show');
		view.chooseAvatar();
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
					view.aiChoice();
				}
			}
		});
	},

	// Disable user's ability to click on boxes
	cantClick: function(){
		$(".box").off("click");
	},

	aiChoice: function(){
		var board = controller.getBoard();
		var options = [];
		for(var key in board){
			if(board[key] === ""){
				options.push(key);
			}
		}
		var length = options.length;
		var box = Math.floor((Math.random() * length));
		// box will be a number 0 through (options.length -1)
		box = options[box];
		controller.updateBox(box, "ai");
		var avatar = controller.getAvatar("ai");
		$("#" + box).text(avatar);
		controller.checkForWinner(avatar);
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
			view.aiChoice();
			view.boxClick();
		}
	}

};


// Run at start
controller.init();