module.exports = function(RED) {
    function NumberIncrementNode(config) {
        
        RED.nodes.createNode(this,config);
        var node = this;

        node.source_object = config.source_object||"msg";
        node.source_property = config.source_property||"payload";
        node.source_property_parts = node.source_property.split(".");

        node.target_object = config.source_object||"msg";
        node.target_property = config.source_property||"payload";
        node.target_property_parts = node.target_property.split(".");

        node.increment_by = config.increment_by*1 || 1;
        
        this.on('input', function(msg) {
            var sourceObj = msg;
            if(node.source_object=="context"){
                sourceObj = msg;
            }else if(node.source_object=="context.global"){
                sourceObj = context.global;
            }

            var propVal = node.source_property_parts.reduce(function(obj, i){
                return obj[i];
            }, sourceObj);

            if(isNaN(propVal)){
                node.send(msg);
                return;
            }else{
                propVal = propVal*1;
            }

            var obj = sourceObj;

            for(var i=0;i<node.target_property_parts.length;i++){
                var propName = node.target_property_parts[i];
                if((typeof obj[propName])=="undefined"){
                    if(i<node.target_property_parts.length-1){
                        obj[propName] = {};
                    }else{
                        obj[propName] = null;
                    }
                }

                if(i<node.target_property_parts.length-1){
                    obj = obj[propName];
                }else{
                    obj[propName] = propVal+node.increment_by;
                }
            }

            node.send(msg);
        });
    }

    RED.nodes.registerType("number-inc", NumberIncrementNode);
};