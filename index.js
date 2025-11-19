import pkg from './package.json' with { type: 'json' };
export const version = pkg.version;
export { IOCongSocket } from './src/client/IOCongSocket.js'
export { IOWS as IO } from './src/client/IOWS.js'
export { pack, CongRx } from './src/client/CongPacket.js'
export { Server } from './src/server/Server.js'
export { serverOption } from './src/server/serverOption.js'
export { FileLogger } from './src/server/FileLogger.js'
export { getSignalPack, parsePayload, getPayloadFromSignalPack } from './src/common/payload.js'
export * from './src/common/constants.js'
export * from './src/common/util.js'

// MBP
export { default as MBP } from 'meta-buffer-pack'

// boho auth
export { default as Boho} from 'boho'
export { BohoAuth } from './src/auth/BohoAuth.js'
export { FileKeyProvider } from './src/auth/key_providers/FileKeyProvider.js'
export { RedisKeyProvider } from './src/auth/key_providers/RedisKeyProvider.js'
export { StringKeyProvider } from './src/auth/key_providers/StringKeyProvider.js'

// services
export * as replyService from './src/services/replyService.js'
export * as sudoService from './src/services/sudoService.js'
export { RedisService } from './src/services/RedisService.js'
