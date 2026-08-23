# Architectural Decisions (ADR) — RailETA Intelligence

## ADR 1: Single Quantile Forecasting Model vs. 3 Independent Regime Models
- **Decision:** Use a single Gradient Boosted Quantile Regressor with operating regime fed in as a contextual feature, rather than 3 separate models for Normal, Delayed, Disrupted.
- **Rationale:** Prevents data fragmentation, maintains unified gradient updates, avoids regime boundary discontinuities, and speeds inference.

## ADR 2: Monotonic Anti-Quantile Crossing Post-Processor
- **Decision:** Post-process raw quantile outputs via sorted bounds `[min(p10, p50), p50, max(p90, p50)]`.
- **Rationale:** Independent quantile regressors can occasionally produce quantile crossing ($p_{10} > p_{50}$ or $p_{50} > p_{90}$) in high-variance regimes. Monotonic sorting guarantees valid intervals.

## ADR 3: Rule-Based Auditable Evidence vs. LLM Generation
- **Decision:** Drive explanation cards strictly from auditable signals (section runtime delta vs median, delay trends, recovery expectation) without generative LLM text.
- **Rationale:** Prevents hallucinated causal claims ("congestion caused this") and maintains high operational trust for railway controllers.

## ADR 4: Leakage-Free Chronological Historical Replay Engine
- **Decision:** Segregate "known so far" from "future ground truth" and cache sequential events.
- **Rationale:** Eliminates data leakage during live judge demonstrations and provides reliable playback without live inference jitter.
