# adventure-layer-ecs
adventure layer ECS

# init dev-tools
```shell
cd react-demo/packages/dev-tools && pnpm i && pnpm build
```

# contracts
### init
```shell
cd react-demo/packages/contracts
pnpm i
cp .env.example .env
source .env
```

### up contracts
```shell
vim mud.config.ts
# build
pnpm build

# deploy to local
pnpm deploy:local
```

### send heartbeat
```shell
# isStart = true
# interval = 1000 (ms)
vim scripts/sendheartbeat.js
pnpm heartbeat
```

### listen events
```shell
pnpm listen
# persistence
pm2 start scripts/listen.js
```

# client
### init
```shell
cd react-demo/packages/client
pnpm i
cp .env.example .env
```

### run dev
```shell
pnpm dev
```

### build
```shell
pnpm build
```
