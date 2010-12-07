(function($){
    /* YQL Cross-Domain Proxy */
    var log = (console && console.log) ? console.log : function(){},
        YQL_XML = "https://github.com/voidfiles/boilerplate-html5-app/raw/master/assets/yql/crosspost.xml",
        YQL_TABLE_NAME = "crosspost";
    $.fetchYQL = function(opts){
        var options = $.extend({
                method: "get",
                success: function(data, status, req ){
                    log(data, status, req);
                },
                error: function(req, status, error){
                    log(req, status, error);
                },
                debug: 'true',
                dataType: "JSON"
            }, opts),
            yql_query = [
                "USE " , YQL_XML, " AS ", YQL_TABLE_NAME, "; ",
                "SELECT * FROM ", YQL_TABLE_NAME, " ",
                "WHERE url='", options.url,"' ",
                "AND method='", options.method, "' "
            ].join( "" ),
            finaly_query = (options.data) 
                ? yql_query + [" AND postData='", options.data, "'"].join("") 
                : yql_query,
            query_encoded_url = [
                "https://query.yahooapis.com/v1/public/yql?q=",
                encodeURIComponent( yql_query ),
                "&diagnostics=" + options.debug,
                "&format=json",
                "&env=store%3A%2F%2Fdatatables.org%2Falltableswithkeys"
            ].join( "" );
            
        $.ajax({
            url:query_encoded_url,
            method: "GET",
            processData: false,
            dataType: options.dataType,
            success: options.success, 
            error: options.error
            
        });
            

    };
    
})(jQuery);