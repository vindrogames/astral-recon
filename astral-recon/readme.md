# Phaser's Revenge

Phaser's Revenge is an adaptation of the classic game Space Invaders.

Your mission is to shoot the enemy ship and dodge its attacks to score as many points as possible in a short amount of time.

## Instructions

1. Clone the repository.
2. Install dependencies with `npm install`.
3. Start the development server with `npm run dev`.
4. If you want to build the project, run `npm run build`.

## Docker instructions

1. First you need to build the container `docker build -t astral-recon .`
2. Now run on dev mode `docker run -p 8000:8000 astral-recon`
3. If you need to have development running while modifying files use:
```
docker run -p 8000:8000 --mount src="$(pwd)/src",target=/app/src,type=bind astral-recon
```
![screenshot](screenshot.png)