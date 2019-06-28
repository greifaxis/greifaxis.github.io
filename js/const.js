//BASIC
const CANV_HEIGHT = 500;
const CANV_WIDTH = 600;
const FPS = 30; //frames per second
const NEXT_LEVEL_DUR = 1;
const NEXT_LEVEL_COUNTDOWN = 3;
const GAME_LIVES = 2;

//SHIP
const SHIP_SIZE = 30; //ship height in pixels
const TURN_SPEED = 360; //turn speed in degrees per second 
const SHIP_THRUST = 6; //acceleration
const SHIP_INV_DUR = 5;
const SHIP_BLINK_DUR = 0.1;// blink during invisibility
const FRICTION = 0.8;   //friction

//LASERS
const LASER_MAX = 10; //maximum number of lasers
const LASER_SPEED = 500; //speed of lasers
const LASER_DISTANCE = 0.7; //max distance of lasers

//ASTEROIDS
const ASTEROIDS_NUM = 1; //starting number of asteroids
const ASTEROIDS_SIZE = 100; //max starting size of asteroids
const ASTEROIDS_SPEED = 50; //max starting speed
const ASTEROIDS_VERT = 10; // average number of asteroid vertices
const ASTEROIDS_JAG = 0.3; // jaggedness of the asteroids (0 = none, 1=lots)
const SHOW_BOUNDING = false; //show or hide collision bounding
const ASTEROIDS_SPEED_MULTIPLIER = 0.25;
const ASTEROIDS_POINTS_L = 20;
const ASTEROIDS_POINTS_M = 50;
const ASTEROIDS_POINTS_S = 100;
