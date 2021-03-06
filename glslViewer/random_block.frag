#ifdef GL_ES
precision mediump float
#endif

uniform vec2 u_resolution;
uniform vec2 u_mouse;
uniform float u_time;

float plot(vec2 st,float pct){
	return smoothstep(pct-0.02,pct,st.y)-smoothstep(pct,pct+0.02,st.y);
}

float rand(vec2 st){
	return fract(sin(dot(st,vec2(12.9379,74.8371)))*42729.6382);
}

float box_size(vec2 st,float n){
	st = (floor(st*n)+0.5)/n;
	float offs = rand(st) * 5.;
	return (1.+sin(u_time*3.+offs))*0.5;
}

float wave(vec2 st,float n){
	st = (floor(st*n)+0.5)/n;
	float d = distance(vec2(0.5,.5),st);
	return (1. + sin(d*3. - u_time*3.)) * 0.5;
}

float box(vec2 st,float size){
	size = 0.5 + size * .5;
	st = step(st,vec2(size)) * step(1.0-st,vec2(size));
	return st.x * st.y;
}

float box_wave(vec2 uv,float n){
	vec2 st = fract(uv*n);
	float size = wave(uv,n);
	return box(st,size);
}

void main(){
	float n = 10.;
	vec2 uv = gl_FragCoord.xy/u_resolution;
	vec2 st = fract(uv*n);

	float size = box_size(uv,n);	
	vec3 color = vec3(box(st,size));
//	vec3 color = vec3(box_wave(st,9.),box_wave(st,18.),box_wave(st,36.));
	gl_FragColor = vec4(color,1.0);
}