var AppView = Backbone.View.extend({

  el : ".container.main",

  initialize: function(){
    this.setUpChoice();
    chooser = new chooserView({model: new Backbone.Model});
    counterV = new counterView({model: new counterModel()});
    counterV.$el.appendTo($('.modal-header'));
    // this.listenTo(this.model, "change", this.render);
  },

  events: {
    "keydown input.chatinput" : "sendMessage"
    

  },

  sendMessage: function(e){
    var input = $(e.currentTarget).val().trim();
    if (e.which!==13 || input == "") return;
    socket.emit('messageSent', { input: input, room: chooser.model.get("myRoom") } );
    $(e.currentTarget).val('');  
  },


  render: function(){ 
  },

  submitEnter : function(e){
    if (e.which === 13 ) {
      this.model.set({"text" : this.$input.val() });
      this.$input.addClass('hide');
      this.$('span').removeClass('hide');
      }
  },

  setUpChoice: function(){
    setTimeout(function(){
    $('#modal1').modal('show');
    }, 400);
    setTimeout(function(){
    animate($('html'), 'fadeIn', 0.9);
    $('#username').focus();
    },850); 
  },

  connect: function(e){
    e.preventDefault();
    if($('#username').val().trim() == ''){
      animate($('#username'), 'swing shake wobble', 1);
      $('#error').html("<div class='alert'>You need a username!</div>");  
      animate($('#error'), 'bounceInDown');
      $('#username').focus();
    }else{
      if (this.authenticated !== true){
        socket = io.connect(window.location.hostname, {
          reconnect:false
        });
        socketBindings();
        console.log($(e.currentTarget).data('lane'));
        var userinfo = {lane: $(e.currentTarget).data('lane'),
                      username: $('#username').val().trim() };
        socket.emit('laneSelected', userinfo);
        $('#modal1 .modal-body').html('Joining please wait...');
      }
    }
  },

  delete : function(){
    this.$el.addClass('animated bounceOutLeft');
    var model = this.model;
    setTimeout(function(){model.destroy()}, 150)
    
  }

});