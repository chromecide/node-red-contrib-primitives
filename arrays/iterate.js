module.exports = function(RED) {
    function IterateNode(config) {
        
        RED.nodes.createNode(this,config);
        var node = this;

        node.source_object = config.source_object||"msg";
        node.source_property = config.source_property||"payload";
        node.source_property_parts = node.source_property.split(".");

        node.target_object = config.target_object||"msg";
        node.target_property = config.target_property||"payload";
        node.target_property_parts = node.target_property.split(".");

        this.on('input', function(msg) {

            if( (typeof(msg._iterator)) == "undefined" ){
                msg._iterator = {
                    msg: msg,
                    items: []
                };

                var sourceObj = msg;
                if(node.source_object=="context"){
                    sourceObj = msg;
                }else if(node.source_object=="context.global"){
                    sourceObj = context.global;
                }

                var propVal = node.source_property_parts.reduce(function(obj, i){
                    return obj[i];
                }, sourceObj);

                if(!Array.isArray(propVal)){
                    propVal = [propVal];
                }

                //clone the array
                for(var i=0;i<propVal.length;i++){
                    msg._iterator.items.push(propVal[i]);
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