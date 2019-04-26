float circle(vec2 p,float r){
    return length(p)-r;
}

vec3 calc(vec2 p){
    float d = circle(p,0.4);
    return vec3(pow(clamp(1.0-d,0.0,1.0),5.0));
}

void mainImage(out vec4 fragColor,in vec2 fragCoord){
    //原点を中心に持ってきながら、正規化する。-1.0~1.0の範囲。
    vec2 uv = (2.0*fragCoord.xy - iResolution.xy) / min(iResolution.x,iResolution.y);
    fragColor = vec4(calc(uv),1.0);
}