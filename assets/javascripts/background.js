(function($, SimpleNote){
    if(air && typeof(air.Introspector.Console.log) !== "undefined"){
        window.console = {
            log: air.Introspector.Console.log
        };
    }
    var SN = new SimpleNote(),
        storage_options = {
            adaptor: (typeof(localStorage) !== "undefined") ? "dom" : (typeof(window.runtime) !== "undefined") ? "air-async" : (typeof(navigator.store) !== "undefined") ? "blackberry" : "dom",
            table: "appdata"
        },
        storage = new Lawnchair(storage_options),
        offlineQue = new Lawnchair(storage_options),
        genericError = function(message){
            console.log(message);
        },
        noteNoKey = function(){
            $(document).trigger("noteNoKey", [{text:""}]);
        },
        getNote = function(callbackEvent){
            return function(data, key, bust){
                var success = false,
                    args = [];
                    
                if(key){
                    args.push(key);
                } 
                if(!data || bust){
                    success = function( noteHash ) {
                      noteHash.ret = new Date().getTime();
                      noteHash.key = key;
                      storage.save(noteHash);
                      delete noteHash.ret;
                      args.push(noteHash);
                      $(document).trigger(callbackEvent, args);
                    };
                } else {
                    noteHash = data;
                    var reted = noteHash.ret,
                        yesterday = Date.now().add(-1).days(),
                        ret = new Date(reted);
                    delete noteHash.ret;
                    args.push(noteHash);

                    $(document).trigger(callbackEvent, args);
                    if(yesterday > ret){
                        success = function( noteHash ) {
                            noteHash.ret = new Date().getTime();
                            noteHash.key = key;
                            storage.save(noteHash);
                        };
                    }
                }
                if(success){
                    SN.retrieveNote({
                      key: key,
                      success:success,
                      error: genericError
                    });
                }
            };
        },
        noteInfoHandler = getNote("noteKey"),
        noteGotHandler = getNote("noteGot");
        
    window.Storage = storage;
    SN.enableDebug( true );   // because we're curious
    window.SN = SN;
    $(document).bind("login", function(e){
        storage.get("emailpassword", function(emailpassword){
            if(emailpassword){
                storage.get("authcode", function(data){
                    var success = false;
                   if(data){
                       var yesterday = Date.now().add(-1).days(),
                           reted = new Date(data.ret);
                       console.log(data);
                       SN.setAuthDetails(emailpassword.email, data.token);
                       $(document).trigger("loginGood");
                       if(yesterday > reted){
                           success = function(data) {
                                var new_data = {
                                    key: "authcode",
                                    token: data,
                                    ret: new Date().getTime()
                                };
                                console.log("saving", new_data);
                                storage.save(new_data);
                            };
                       }
                       
                   } else {
                       success = function(data) {
                            var new_data = {
                                key: "authcode",
                                token: data,
                                ret: new Date().getTime()
                            };
                            console.log("saving", new_data, SN);
                            storage.save(new_data);
                          $(document).trigger("loginGood");
                        };
                   }
                    
                  if(success){
                      SN.auth({
                        email: emailpassword.email,
                        password: emailpassword.password,
                        success: success,
                        error: function( code ) {
                          console.log( "Authentication error: " + code );
                          $(document).trigger("loginBad");
                        }
                      });
                  }
                });

                return true;
            }
            $(document).trigger("loginBad");
            return false;
        });
    });
    
    
    $(document).bind("index", function(e, bust){
        storage.get("indexData", function(data){
            var success = false;
            if(!data || bust){
                success = function( resultsArray ) {
                    var indexData = {
                            key: "indexData",
                            data: resultsArray,
                            ret: new Date().getTime()
                        };
                    
                    storage.save(indexData);
                    $(document).trigger("indexData", [resultsArray]);
                };
            } else {
               var resultsArray = data.data,
                   yesterday = Date.now().add(-1).days(),
                   ret = new Date(data.ret);
                   
               $(document).trigger("indexData", [resultsArray]);
               if(yesterday > ret){
                   success = function( resultsArray ) {
                       $(document).bind("finishedIndex", function(e){
                           var indexData = {
                                   key: "indexData",
                                   data: resultsArray,
                                   ret: new Date().getTime()
                               };
                           storage.save(indexData);
                       });
                   };
               }
                   
           }
           if(success){
               try{
                   SN.retrieveIndex({
                       success:success,
                       error: genericError
                   });
               } catch(e){
                   console.log(e);
                   storage.remove("authcode");
                   $(document).trigger("login");
               }
           }
           
        });
        
        return false;
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
          error: genericError
        });
        return false;
    });
        
    $(document).bind("noteInfo", function(e, key){ 
        storage.get(key, function(data){ noteInfoHandler(data, key); });
        return true;
    });
    $(document).bind("note", function(e, key){ 
        if (key === undefined) {
             $(document).trigger("noteGot", [key, {}]);
             return true;
        }
        storage.get(key, function(data){ noteGotHandler(data, key); });
        return true;
    });
    $(document).bind("destroy", function(e, key){ 
        SN.deleteNote({
          key: key,
          success: function( noteID ) {
            //console.info( noteID );
            console.log("need to remoe", noteID);
            Storage.remove(noteID );
            $(document).trigger('index',[true]); 
            $(document).trigger("destroyDone");
            
          },
          error: function( code ) {
            console.log( code );
          }
        });
    });
    $(document).bind("update", function(e, key, data){
        
        try{
        if(!key){
            SN.createNote({
              body: data,
              success: function( noteID ) {
                $(document).trigger("updateDone",[ noteID, true]);
              },
              error: function( code ) {
                console.log( code );
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
                    console.log( code );
                  }
                });

        }
        } catch(e){
          if(e != "AuthError"){
              throw(e);
          }
          console.log(e);
          storage.remove("authcode");
          $(document).trigger("login");
        };
    });
    

    
    $(document).bind("options", function(e){
        $(".options-section").show();
        storage.get("emailpassword", function(data){
            if(data){
                $("#email").val(data.email);
                $("#password").val(data.password);
            }
        });
        return false;
    });

    /*
     * Saves options to localStorage.
     * @param ms Milliseconds to fade in the status message.
     */
    $(".save-button").live('click', function(e) {
      e.preventDefault();
      var data = {
              key:"emailpassword",
              email: $("#email").val(),
              password: $("#password").val()
          },
          status = $("#status");
      
      storage.save(data);


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
        storage.get("emailpassword", function(data){
            if(data){
                $(document).trigger("login");
            } else {
                var message = "Please " + signUpLink + " for a Simplenote account and enter your credentials on the " + optionsLink + ".";
                displayStatusMessage(message);
            }
        });
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
        data = _.sortBy(data, function(item){ return item.modify; }).reverse();
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
        var bust = false;
        if(query && typeof(query) !== "string") {
            bust = query;
            query = false;
        }

      $('#loader').show();
      $("#toolbar").show();
      if(query) {        
        $(document).trigger('search',[query]);
        $('#notes').empty();
      } else {
          console.log("bust", bust);
         $(document).trigger('index', [bust]); 
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
    $(document).bind("updateDone", function(e, data, bust){
        $('div#note textarea').hide();
        $('div#note').hide();
        showIndex(bust);
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
        showIndex(true); 
    });

    function destroyNote(key) {
      $('div#note div#toolbar input').attr('disabled', 'disabled');
      $(document).trigger("destroy", [key]);
    };

})(jQuery,SimpleNote);