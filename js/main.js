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

	// Uses model.board to return a board in a format resembling a tic, tac, toe board
	getBoardB: function(){
		board = controller.getBoard();
		board = [
			[ board.topLeft,    board.topMiddle,    board.topRight    ],
			[ board.middleLeft, board.middleMiddle, board.middleRight ],
			[ board.bottomLeft, board.bottomMiddle, board.bottomRight ]
		];
		return board;
	},

	// Returns an array of winning rows.
	getWinningRows: function(){
		board = controller.getBoardB();
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
		return winningRows;
	},

	// Winning rows represeted by strings
	stringifiedRows: 	[	
					// horizontal rows
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
				],

	// Check for winner or tie
	checkForWinner: function(XorO){
		var winningRows = controller.getWinningRows();
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
				controller.updateWinner(true);
				controller.endGame("winner", avatar);
				return;
			}
		}

		if (controller.checkTie()){
			controller.endGame("tie");
		}
	},

	endGame: function(winnerOrTie, avatar){
		view.cantClick();
		var winnerIs = '';

		if(winnerOrTie === "winner"){
			var avatars = model.avatar;
			// Check to see if avatar belongs to user or computer(ai);
			if(avatar === avatars.user){
				winnerIs = "user";
			} else if(avatar === avatars.ai){
				winnerIs = "ai";
			}
			view.showWinner(winnerIs);	
		} else if (winnerOrTie === 'tie'){
			view.showWinner('tie');
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
		if(controller.checkWinningMove()){
			return;
		} else if(controller.blockUser()){
			return;
		} else if(controller.chooseCenter()){
			return;
		} else if(controller.chooseOppCorner()){
			return;
		} else if(controller.chooseCorner()){
			return;
		} else{
			controller.chooseSide();
			return;
		}
	},

	checkWinningMove: function(){
		var winningRows = controller.getWinningRows();
		var aiAvatar = controller.getAvatar('ai');
		var stringifiedRows = controller.stringifiedRows;
		for(var i = 0; i < winningRows.length; i++){

			inARow = 0;
			for(var j = 0; j < winningRows[i].length; j++){
				if(winningRows[i][j] === aiAvatar){
					inARow ++;
				}
			}
			if(inARow === 2){	
				winningRow = winningRows[i];
				winningStrings = stringifiedRows[i];

				for(var n = 0; n < winningRow.length; n++){
					if(winningRow[n] === ''){
						box = winningStrings[n];
						controller.updateBox(box, "ai");
						view.renderAIChoice(box);
						controller.checkForWinner(aiAvatar);
						return true;
					}
				}
			} else {
				inARow = 0;
			}
		}
	},

	//Block if user has two in a row
	blockUser: function(){
		var winningRows = controller.getWinningRows();
		var aiAvatar = controller.getAvatar('ai');
		var stringifiedRows = controller.stringifiedRows;
		var userAvatar = controller.getAvatar('user'); 

		for(var k = 0; k < winningRows.length; k++){
			inARow = 0;
			for(var p = 0; p < winningRows[k].length; p++){
				if(winningRows[k][p] !== userAvatar){
				} else {
					inARow ++;
				}
			}
			if(inARow === 2){		
				winningRow = winningRows[k];
				winningStrings = stringifiedRows[k];

				for(var m = 0; m < winningRow.length; m++){
					if(winningRow[m] === ''){
						box = winningStrings[m];
						controller.updateBox(box, "ai");
						view.renderAIChoice(box);
						controller.checkForWinner(aiAvatar);
						return true;
					}
				}
			} else {
				inARow = 0;
			}
		}
	},

	// If user chose a corner, choose opposite corner
	chooseOppCorner: function(){
		var userAvatar = controller.getAvatar('user'); 
		var aiAvatar = controller.getAvatar('ai');
		var board = controller.getBoard();
		var corners = ['topLeft', 'topRight', 'bottomLeft', 'bottomRight'];
		var oppositeCorner = false;
		if(board[corners[0]] === userAvatar && board[corners[3]] === ''){
			box =  corners[3];
			oppositeCorner = true;
		} else if(board[corners[1]] === userAvatar && board[corners[2]] === '' ){
			box =  corners[2];
			oppositeCorner = true;
		} else if(board[corners[2]] === userAvatar && board[corners[1]] === ''){
			box =  corners[1];
			oppositeCorner = true;
		} else if(board[corners[3]] === userAvatar && board[corners[0]] === ''){
			box =  corners[0];
			oppositeCorner = true;
		}
		if(oppositeCorner === true){
			controller.updateBox(box, "ai");
			view.renderAIChoice(box);
			controller.checkForWinner(aiAvatar);
			return true;
		}
	},

	// If corner available, pick a corner
	chooseCorner: function(){
		var board = controller.getBoard();
		var aiAvatar = controller.getAvatar('ai');
		var corners = ['topLeft', 'topRight', 'bottomLeft', 'bottomRight'];
		for(var c = 0; c < corners.length; c++){
			if (board[corners[c]] === ""){
				var box = corners[c];
				controller.updateBox(box, "ai");
				view.renderAIChoice(box);
				controller.checkForWinner(aiAvatar);
				return true;
			}
		}
	},

	// Choose center if Available
	chooseCenter: function(){
		var board = controller.getBoard();
		var aiAvatar = controller.getAvatar('ai');
		if(board.middleMiddle === ''){
			controller.updateBox('middleMiddle', "ai");
			view.renderAIChoice('middleMiddle');
			controller.checkForWinner(aiAvatar);
			return true;
		}
	},

	// Pick a side if available (should be if function reaches this point)
	chooseSide: function(){
		var sides = ['topMiddle', 'middleLeft', 'middleRight', 'bottomMiddle'];
		for (var s = 0; s < sides.length; s++){
			if(board[sides[s]] === ''){
				box = sides[s];
				controller.updateBox(box, "ai");
				view.renderAIChoice(box);
				controller.checkForWinner(aiAvatar);
				return true;
			}
		}
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
					controller.aiChoice();
				}
			}
		});
	},

	renderAIChoice: function(box){
		var aiAvatar = controller.getAvatar('ai');
		$("#" + box).html("<span class='purpleText'>" + aiAvatar + "</span>");
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