(function($, SimpleNote){
    
    var SN = new SimpleNote();
    SN.enableDebug( true );   // because we're curious
    
    var  noteNoKey = function(){
            $(document).trigger("noteNoKey", [{text:""}]);
        };
    $(document).bind("login", function(e){
        if(localStorage.email && localStorage.password) {
            SN.auth({
              email: localStorage.email,
              password: localStorage.password,
              success: function() {
                $(document).trigger("loginGood");
                // >> true
              },
              error: function( code ) {
                console.error( "Authentication error: " + code );
                $(document).trigger("loginBad");
              }
            });
        }
    });
    
    
    $(document).bind("index", function(e){
        if(!localStorage.indexData){
            SN.retrieveIndex({
              success: function( resultsArray ) {
                  localStorage.indexDataRet = new Date().getTime();
                  localStorage.indexData = JSON.stringify(resultsArray);
                  $(document).trigger("indexData", [resultsArray]);
              },
              error: function( code ) {
                  console.error( code );
              }
            });
        } else {
            $(document).trigger("indexData", [JSON.parse(localStorage.indexData)]);
            var yesterday = Date.now().add(-1).days(),
                ret = new Date(localStorage.indexDataRet);
            
            if(yesterday > ret){
                SN.retrieveIndex({
                  success: function( resultsArray ) {
                      $(document).bind("finishedIndex", function(e){
                          localStorage.indexData = JSON.stringify(resultsArray);
                      });
                  },
                  error: function( code ) {
                      console.error( code );
                  }
                });
            }
        }
    });
    
    
    $(document).bind("search", function(e, query){ 
        if(!query || query == ""){
            $(document).trigger("index");
            return false;
        }
        SN.searchNotes({
          query: query,
          maxResults: 6,
          success: function( resultsHash ) {
            //console.info( resultsHash.totalRecords );
            console.log(resultsHash);
            $(document).trigger("indexData", [resultsHash.notes]);
          },
          error: function( code ) {
            console.error( code );
          }
        });
        return false;
    });
    
    
    $(document).bind("noteInfo", function(e, key){ 
        var cache_key = "note:" + key;
        if(!localStorage[cache_key]){
            SN.retrieveNote({
              key: key,
              success: function( noteHash ) {
                noteHash.ret = new Date().getTime();
                localStorage[cache_key] = JSON.stringify(noteHash);
                $(document).trigger("noteKey", [key, noteHash]);
                // >> {
                // >>   body: "my example note",
                // >>   key: "[SimpleNote-internal ID string]",
                // >>   modifydate: [Date object],
                // >>   createdate: [Date object],
                // >>   deleted: false
                // >> }
              },
              error: function( code ) {
                console.error( code );
              }
            });
        } else {
            noteHash = JSON.parse(localStorage[cache_key]);
            var reted = noteHash.ret,
                yesterday = Date.now().add(-1).days(),
                ret = new Date(reted);
            delete noteHash.ret;
            $(document).trigger("noteKey", [key, noteHash]);

            if(yesterday > ret){
                SN.retrieveNote({
                  key: key,
                  success: function( noteHash ) {
                    localStorage[cache_key] = JSON.stringify(noteHash);
                    // >> {
                    // >>   body: "my example note",
                    // >>   key: "[SimpleNote-internal ID string]",
                    // >>   modifydate: [Date object],
                    // >>   createdate: [Date object],
                    // >>   deleted: false
                    // >> }
                  },
                  error: function( code ) {
                    console.error( code );
                  }
                });
            }
        }
        
        
    });
    $(document).bind("note", function(e, key){ 
        if (key === undefined) {
             $(document).trigger("noteGot", [key, {}]);
             return;
        }
        var cache_key = "note:" + key;
        if(!localStorage[cache_key]){
            SN.retrieveNote({
              key: key,
              success: function( noteHash ) {
                localStorage[cache_key] = JSON.stringify(noteHash);
                $(document).trigger("noteGot", [key, noteHash]);
                // >> {
                // >>   body: "my example note",
                // >>   key: "[SimpleNote-internal ID string]",
                // >>   modifydate: [Date object],
                // >>   createdate: [Date object],
                // >>   deleted: false
                // >> }
              },
              error: function( code ) {
                console.error( code );
              }
            });
        } else {
            $(document).trigger("noteGot", [key, JSON.parse(localStorage[cache_key])]);
            SN.retrieveNote({
              key: key,
              success: function( noteHash ) {
                localStorage[cache_key] = JSON.stringify(noteHash);
                // >> {
                // >>   body: "my example note",
                // >>   key: "[SimpleNote-internal ID string]",
                // >>   modifydate: [Date object],
                // >>   createdate: [Date object],
                // >>   deleted: false
                // >> }
              },
              error: function( code ) {
                console.error( code );
              }
            });
        }        
    });
    $(document).bind("destroy", function(e, key){ 
        SN.deleteNote({
          key: key,
          success: function( noteID ) {
            //console.info( noteID );
            $(document).trigger("destroyDone");
            // >> "[SimpleNote-internal ID string]"
          },
          error: function( code ) {
            console.error( code );
          }
        });
    });
    $(document).bind("update", function(e, key, data){
        
        if(!key){
            SN.createNote({
              body: data,
              success: function( noteID ) {
                console.info( noteID );
                $(document).trigger("updateDone",[ noteID]);
                // >> "[new SimpleNote-internal ID string]"
              },
              error: function( code ) {
                console.error( code );
              }
            });
        } else {
            SN.updateNote({
              key: key,
              body: data,
              success: function( noteID ) {
                //console.info( noteID );
                 $(document).trigger("updateDone",[ noteID]);
                // >> "[SimpleNote-internal ID string]"
              },
              error: function( code ) {
                console.error( code );
              }
            });
        }
    });
    
    $(document).ready(function() {
      if (localStorage) {
        $("#email").val(localStorage.email);
        $("#password").val(localStorage.password);
      }
    });
    
    $(document).bind("options", function(e){
        $(".options-section").show();
        if (localStorage) {
          $("#email").val(localStorage.email);
          $("#password").val(localStorage.password);
        }
        return false;
    });

    /*
     * Saves options to localStorage.
     * @param ms Milliseconds to fade in the status message.
     */
    $(".save-button").live('click', function(e) {
      e.preventDefault();
      if (localStorage) {
          localStorage.email = $("#email").val();
          localStorage.password = $("#password").val();	
      }

      var status = $("#status");
      status.show();
      if (localStorage && localStorage.email && localStorage.password) {
        status.html("Account saved");
      } else {
        status.html("Save failed");
      }

      $(document).trigger("login");
      status.hide();
      $(".options-section").hide();
    });
    
    $(".show_options").live("click", function(e){
        e.preventDefault();
        $('#status').hide();
        $(document).trigger("options");
        return false;
    });
    var signUpLink =
        "<a href='http://simplenoteapp.com/create-account'>sign up</a>";
    var optionsLink =
        "<a class='show_options' href='#options'>options page</a>";
    // Log in on page load
    $(document).ready(function() {
      if ((!localStorage.email) || (!localStorage.password)) {
        var message = "Please " + signUpLink + " for a Simplenote account and enter your credentials on the " + optionsLink + ".";
        displayStatusMessage(message);
      } else {
          $(document).trigger("login");
      }
    });
    
    $(document).bind("loginGood",function(){
        showIndex();
        $('div#index div#toolbar input#new').click(function() {
          showNote();
        });
        $('div#index div#toolbar input#search').click(function() {
          showIndex($('#q').val());
        });
        $('input#q').focus();
    });
    $(document).bind("loginBad", function(){
        var message = "Please correct your username and password on the " + optionsLink + "!";
        displayStatusMessage(message);
    });

    /*
     * Displays a status message.
     * @param message The HTML content of the status message to display. All links
     *     in the message are be adjusted to open in a new window and close the
     * ß    popup.
     */
    function displayStatusMessage(message) {
        $('#loader').hide();
        $('#toolbar').hide();
        $('#status').show();
        $('#status').html(message);
    }

    $(document).bind("noteKey", function(e, key, text){
        text = text.body;
        var lines = text.split("\n", 10).filter(function(line) { return ( line.length > 0 ); });
        $('#' + key).html(
          lines[0] + "<div class='abstract'>" + lines.slice(1,3).map(function(element) { 
              var shrt = element.substr(0, 67); 
              return ( shrt.length + 3 < element.length ? shrt + "..." : element );
          }).join("<br />") + "</div>");
        $('#' + key).unbind();
        $('#' + key).click(function() { showNote(this.id); });

    });
    $(document).bind("indexData", function(e, data){
        $('div#index').show();
        $('#loader').hide();
        var count = 0;
        for(var i=0; i < data.length; i++) {
          if (data[i].deleted) {
            var note = $('#' + data[i].key);
            if (note.length > 0) { note.hide(); }
          } else {
            if ($('#' + data[i].key).length == 0) {
              $('#notes').append("<li id='" + data[i].key + "'></li>");
            }
            $(document).trigger("noteInfo", data[i].key);

          }
        }
        $(document).trigger("finishedIndex");
    });
    function showIndex(query) {
      $('#loader').show();
      $("#toolbar").show();
      if(query) {        
        $(document).trigger('search',[query]);
        $('#notes').empty();
      } else {
         $(document).trigger('index'); 
      }
      
      
    }

    $(document).bind("noteGot", function(e, key, data) {
        data = data.body;
        if(data){
            $('div#note textarea').val(data);
        } else {
            $('div#note textarea').val("");
        }
        var text_area_height = $(window).height() - ($("#note").height() + 14) ; 
        $('div#note textarea').show().height(text_area_height);
        
        $('div#note input#save').unbind();
        $('div#note input#save').click(function(e) {
            e.preventDefault();
            updateNote(key);
            return false;
        });
        $('div#note input#destroy').unbind();
        $('div#note input#destroy').click(function() {
          destroyNote(key);
        });
        $('#loader').hide();
      });
    function showNote(key) {
      $('#loader').show();
      $('div#index').hide();
      $('div#note').show();
      $('div#note div#toolbar input').removeAttr('disabled');
      if (key === undefined) {
        $('div#note div#toolbar input#destroy').hide();
      } else {
        $('div#note div#toolbar input#destroy').show();
      }
      $(document).trigger("note", [key]);
      
      
    }
    $(document).bind("updateDone", function(e, data){
        $('div#note textarea').hide();
        $('div#note').hide();
        showIndex();
    });
    function updateNote(key) {
      $('div#note div#toolbar input').attr('disabled', 'disabled');
      var data = $('div#note textarea').val();
      if (data != '') {
          $(document).trigger("update", [key, data]);
      } else {
          $(document).trigger("updateDone");  
      }
    }
    
    $(document).bind("destroyDone", function(e){
        $('div#note textarea').hide();
        $('div#note').hide();
        showIndex(); 
    });

    function destroyNote(key) {
      $('div#note div#toolbar input').attr('disabled', 'disabled');
      $(document).trigger("destroy", [key]);
    };

})(jQuery,SimpleNote);