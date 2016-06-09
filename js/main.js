/* Model 
==============================*/
var model = {

	avatar: {
		user: 'X',
		ai: null
	},

	boxes: {
		topLeft: null,
		topMiddle: null,
		topRight: null,
		middleLeft: null,
		middleMiddle: null,
		middleRight: null,
		bottomLeft: null,
		bottomMiddle: null,
		bottomRight: null,
	}

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

	updateBox: function(boxName){
		model.boxes[boxName] = "boom";
	},

	getBox: function(boxName){
		return model.boxes[boxName];
	},

	getAvatar: function(userOrAI){
		if(userOrAI === 'user'){
			return model.avatar.user;
		} else if(userOrAI === 'ai'){
			return model.avatar.user;
		}
	}

};



/* View 
==============================*/

var view = {

	init: function(){
		// $('#myModal').modal('show');
		// view.chooseAvatar();
		view.boxClick();
	},

	chooseAvatar: function(){
		view.avatarX();
		view.avatarO();
	},

	avatarX: function(){
		$("#avatarX").on("click", function(){
			controller.setAvatars('X', 'O');
			$('#myModal').modal('hide');
		});
	},

	avatarO: function(){
		$("#avatarO").on("click", function(){
			controller.setAvatars('O', 'X');
			$('#myModal').modal('hide');
		});
	},

	boxClick: function(){
		$(".box").on("click", function(){
			var box = $(this).attr('id');
			// if box is already filled
			if(controller.getBox(box) !== null){
				return;
			} else {
				controller.updateBox(box);
				$(this).text(controller.getAvatar('user'));
			}
		});
	}
};


// Run at start
controller.init();