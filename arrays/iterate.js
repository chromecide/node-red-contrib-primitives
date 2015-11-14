module.exports = function(RED) {
    function IterateNode(config) {
        
        RED.nodes.createNode(this,config);
        var node = this;

        this.on('input', function(msg) {

            if( (typeof(msg._iterator)) == "undefined" ){
                msg._iterator = {
                    msg: msg,
                    items: []
                };

                //clone the array
                for(var i=0;i<msg.payload.length;i++){
                    msg._iterator.items.push(msg.payload[i]);
                }
            }

            node.status({fill:'blue', shape: 'ring', text: msg._iterator.items.length+' items remaining'});

            var currentItem = msg._iterator.items.shift();
            
            if(currentItem){
                msg.payload = currentItem;
                node.send([msg, null]);
            }else{
                msg = msg._iterator.msg;
                delete msg._iterator;
                
                node.send([null, msg]);
            }
        });
    }

    RED.nodes.registerType("array-iterate", IterateNode);
};