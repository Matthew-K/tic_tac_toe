/* Model 
==============================*/
var model = {

	avatar: {
		user: null,
		ai: null
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
	}

};



/* View 
==============================*/

var view = {

	init: function(){
		$('#myModal').modal('show');
		view.chooseAvatar();
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
	}

};


// Run at start
controller.init();