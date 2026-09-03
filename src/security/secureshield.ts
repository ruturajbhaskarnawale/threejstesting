// src/security/secureshield.ts — Three.js WebGL Context Anti-Tamper & Security Engine
import { SecureShield, SecurityAuditReport } from '@secureshield/web';

export class SecureShieldThreeGuard {
  private static instance: SecureShieldThreeGuard;
  private sdkInstance: any = null;
  public isReady: boolean = false;
  public trustScore: number = 100;
  public lastReport: (SecurityAuditReport & { trustScore?: number }) | null = null;

  private constructor() {}

  public static getInstance(): SecureShieldThreeGuard {
    if (!SecureShieldThreeGuard.instance) {
      SecureShieldThreeGuard.instance = new SecureShieldThreeGuard();
    }
    return SecureShieldThreeGuard.instance;
  }

  /**
   * Initializes SecureShield and hooks WebGL context protection without blocking frame rendering
   */
  public async initialize(canvas?: HTMLCanvasElement): Promise<any> {
    try {
      this.sdkInstance = await SecureShield.init({
        headerKey: 'enc:v1:8f9aefbceebad65ec494b159:fc687c51e099f94e8a0130bd305499d6:9ada8f21163da2cec37060ec6e2b30',
        encryptionKey: 'aAbxBC2zK6WXvdB0pMUgua/JX6bJY0ku4618nzB0Ttw=',
        initializationKey: 'INIT_oiiBXzXOyPoLaGhGIGVHyA0YrLe0UnIi',
        tenantId: 'TEN-DENKIA-2542',
        appId: 'ast_app_278325',
        serverUrl: 'https://radiator-waving-cahoots.ngrok-free.dev/api/v1/telemetry/ingest',
        environment: 'production',            // 🛡️ Set 'production' for live deployment
        skipHandshake: true,
        enableRuntimeIntegrityWatchdog: true,
        enableStorageLeakScrubber: false,      // Kept false on initial boot
        enablePrototypeFreezing: false,        // Required for WebGL / Spector.js extensions
        enableDomLockoutOverlay: false,        // 🚀 Set false in dev to prevent black screen
        blockRedirectUrl: null,

        onTamperDetected: (apiName: string, reason?: string) => {
          console.warn(`[SecureShield 3D Alert] WebGL / Canvas Tamper Detected in ${apiName}: ${reason || 'Anomaly'}`);
        }
      } as any);

      // ⚡ Defer deep audit by 50ms so WebGL canvas and initial 3D mesh render at 60 FPS in 0ms
      setTimeout(async () => {
        try {
          this.lastReport = await this.sdkInstance.evaluateSecurityState();
          this.trustScore = this.lastReport?.trustScore ?? 100;
          this.isReady = true;
          console.log('[SecureShield] Three.js WebGL Guard Initialized ✅. Trust Score:', this.trustScore);
        } catch (e) {
          console.warn('[SecureShield] Background evaluation notice:', e);
        }
      }, 50);

      return this.sdkInstance;
    } catch (err) {
      console.error('[SecureShield] Three.js Security Init Error:', err);
      return null;
    }
  }

  private lastAuditTime: number = 0;
  private cachedIsClean: boolean = true;
  private readonly AUDIT_INTERVAL_MS: number = 3000;

  /**
   * 🛡️ Evaluates whether scene action or user interaction is safe.
   * Throttled to evaluate at most once every 3 seconds to prevent WebGL context thrashing
   * and GPU starvation in 60 FPS requestAnimationFrame render loops.
   */
  public isCleanForAction(): boolean {
    if (!this.sdkInstance) return true;

    const now = performance.now();
    if (now - this.lastAuditTime > this.AUDIT_INTERVAL_MS) {
      this.lastAuditTime = now;
      const audit = this.sdkInstance.runScan();
      this.cachedIsClean = audit.verdict === 'SECURE' && (audit.risk_score || 0) < 50;
    }

    return this.cachedIsClean;
  }
}

export const securityGuard = SecureShieldThreeGuard.getInstance();