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

        node.join_with = config.join_with || " ";

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

            if(!Array.isArray(propVal)){
                propVal = [propVal];
            }

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
                    obj[propName] = propVal.join(node.join_with);
                }
            }

            targetVal = propVal.join(node.join_with);
            node.send(msg);
        });
    }

    RED.nodes.registerType("array-join", StringSplitNode);
};