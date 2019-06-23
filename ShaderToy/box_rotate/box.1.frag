mat2 rot(float a){
    float s = sin(a),c = cos(a);
    return mat2(c,s,-s,c);
}

float sdBox(vec3 pos,float r){
    pos = abs(pos) - r;
    return max(pos.z,max(pos.x,pos.y));
}

float sdSphere(vec3 pos,float r){
    return length(pos)-r;
}


float distanceFunc(vec3 pos){
    return sdBox(vec3(pos.xy*rot(iTime),pos.z),0.2);
}

void mainImage(out vec4 fragColor,in vec2 fragCoord){
    vec2 uv = (fragCoord.xy * 2.0 - iResolution.xy)/min(iResolution.x,iResolution.y);
    //raymarching
    int iter = 3;
    vec3 cameraPos = vec3(0.,0.,-5.);
    float screenZ = 2.5;
    vec3 rayDir = normalize(vec3(uv,screenZ));
    
    float depth = 0.0;
    vec3 color = vec3(0.0);

    for(int i=0;i<iter;i++){
        vec3 rayPos = cameraPos + rayDir * depth;
        float dist = distanceFunc(rayPos);
        if(dist < 0.0001){
            color = vec3(1.0,1.0,1.0);
            break;
        }
        depth += dist;
    }

    fragColor = vec4(color,1.);
}