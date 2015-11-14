module.exports = function(RED) {
    function StringSplitNode(config) {
        
        RED.nodes.createNode(this,config);
        var node = this;

        node.source_object = config.source_object||"msg";
        node.source_property = config.source_property||"payload";
        node.source_property_parts = node.source_property.split(".");

        node.target_object = config.target_object||"msg";
        node.target_property = config.target_property||"payload";
        node.target_property_parts = node.target_property.split(".");

        node.split_on = config.split_on || " ";
        switch(node.split_on){
            case "\\n":
                node.split_on = "\n";
                break;
            case "\\r\\n":
                node.split_on = "\r\n";
                break;
            case "\\t":
                node.split_on = "\t";
                break;
        }
        this.on('input', function(msg) {
            var sourceObj = msg;
            if(node.source_object=="context"){
                sourceObj = msg;
            }else if(node.source_object=="context.global"){
                sourceObj = context.global;
            }

            var targetObject = msg;
            if(node.target_object=="context"){
                targetObject = msg;
            }else if(node.target_object=="context.global"){
                targetObject = context.global;
            }

            var propVal = node.source_property_parts.reduce(function(obj, i){
                return obj[i];
            }, sourceObj);

            console.log(propVal.split(node.split_on));

            var obj = targetObject;

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
                    obj[propName] = propVal.split(node.split_on);
                }
            }

            targetVal = propVal.split(node.split_on);
            console.log(msg);
            //msg.payload = msg.payload.toLowerCase();
            node.send(msg);
        });
    }

    RED.nodes.registerType("string-split", StringSplitNode);
};