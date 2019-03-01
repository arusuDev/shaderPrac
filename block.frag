#ifdef GL_ES
precision mediump float
#endif

uniform vec2 u_resolution;
uniform vec2 u_mouse;
uniform float u_time;

float plot(vec2 st,float pct){
	return smoothstep(pct-0.02,pct,st.y)-smoothstep(pct,pct+0.02,st.y);
}

float wave(vec2 st){
	float d = distance(vec2(0.5,.5),st);
	return (1. + sin(d*3. - u_time*3.)) * 0.5;
}

float box(vec2 st,float size){
	size = 0.5 + size * .5;
	st = step(st,vec2(size)) * step(1.0-st,vec2(size));
	return st.x * st.y;
}

void main(){
	float n = 10.;
	vec2 st = fract(gl_FragCoord.xy/u_resolution*n);
	
	vec3 color = vec3(wave(st))*vec3(.5);



	gl_FragColor = vec4(color,1.0);
}