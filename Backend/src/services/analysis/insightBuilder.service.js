/**
 * Insight Builder Service
 *
 * Converts numerical analysis results into human-readable insights
 * Rule-based logic - no AI/ML
 *
 * Generates:
 * - Performance insights
 * - Diversification insights
 * - Risk warnings
 * - Actionable recommendations
 *
 * ⚠️ Does NOT override demo disclaimers
 * ⚠️ No Express/controller logic here
 */

/**
 * Build all insights from analysis results
 *
 * @param {Object} performance - Performance analysis results
 * @param {Object} diversification - Diversification analysis results
 * @param {Object} portfolio - Portfolio metadata
 * @returns {Object} Structured insights
 */
export function buildInsights(performance, diversification, portfolio) {
  const insights = {
    summary: buildSummaryInsight(performance, diversification, portfolio),
    performance: buildPerformanceInsights(performance),
    diversification: buildDiversificationInsights(diversification),
    risks: buildRiskInsights(diversification, performance),
    recommendations: buildRecommendations(diversification, performance),
    highlights: [],
  };

  // Build highlights (top 3 key points)
  insights.highlights = buildHighlights(insights);

  return insights;
}

/**
 * Build summary insight
 */
function buildSummaryInsight(performance, diversification, portfolio) {
  const { totalInvested, currentValue, absoluteReturnPercent, xirr } =
    performance.summary;

  // Determine overall health
  let healthScore = "good";
  let healthLabel = "Healthy";

  if (diversification.warnings.length > 2 || absoluteReturnPercent < 0) {
    healthScore = "needs_attention";
    healthLabel = "Needs Attention";
  } else if (diversification.warnings.length > 0 || absoluteReturnPercent < 5) {
    healthScore = "moderate";
    healthLabel = "Moderate";
  }

  return {
    portfolioName: portfolio.name || "Your Portfolio",
    fundCount: diversification.fundCount,
    totalInvested: formatCurrency(totalInvested),
    currentValue: formatCurrency(currentValue),
    returns: `${
      absoluteReturnPercent >= 0 ? "+" : ""
    }${absoluteReturnPercent}%`,
    xirr: xirr !== null ? `${xirr >= 0 ? "+" : ""}${xirr}%` : "N/A",
    healthScore,
    healthLabel,
    message: buildSummaryMessage(
      absoluteReturnPercent,
      diversification.fundCount
    ),
  };
}

/**
 * Build summary message based on performance
 */
function buildSummaryMessage(returnPercent, fundCount) {
  if (returnPercent >= 15) {
    return "Your portfolio is performing excellently! Strong returns indicate good fund selection.";
  } else if (returnPercent >= 10) {
    return "Your portfolio is performing well. Returns are above average for the period.";
  } else if (returnPercent >= 5) {
    return "Your portfolio is showing moderate growth. Consider reviewing underperformers.";
  } else if (returnPercent >= 0) {
    return "Your portfolio has minimal gains. Review your investment strategy.";
  } else {
    return "Your portfolio is currently in loss. Markets can be volatile - consider your long-term goals.";
  }
}

/**
 * Build performance-specific insights
 */
function buildPerformanceInsights(performance) {
  const insights = [];
  const { summary, fundPerformance } = performance;

  // Overall return insight
  insights.push({
    type: "return_overview",
    title: "Return Overview",
    value: `${summary.absoluteReturnPercent}%`,
    description: getReturnDescription(summary.absoluteReturnPercent),
    sentiment:
      summary.absoluteReturnPercent >= 10
        ? "positive"
        : summary.absoluteReturnPercent >= 0
        ? "neutral"
        : "negative",
  });

  // XIRR insight
  if (summary.xirr !== null) {
    insights.push({
      type: "xirr",
      title: "Annualized Return (XIRR)",
      value: `${summary.xirr}%`,
      description: getXirrDescription(summary.xirr),
      sentiment:
        summary.xirr >= 12
          ? "positive"
          : summary.xirr >= 6
          ? "neutral"
          : "negative",
    });
  }

  // Top performer
  if (fundPerformance.length > 0) {
    const sorted = [...fundPerformance].sort(
      (a, b) => b.absoluteReturnPercent - a.absoluteReturnPercent
    );

    const topPerformer = sorted[0];
    if (topPerformer.absoluteReturnPercent > 0) {
      insights.push({
        type: "top_performer",
        title: "Top Performer",
        value: topPerformer.fundName,
        subValue: `+${topPerformer.absoluteReturnPercent}%`,
        description: `${topPerformer.fundName} is your best performing fund with ${topPerformer.absoluteReturnPercent}% returns.`,
        sentiment: "positive",
      });
    }

    // Bottom performer (if negative)
    const bottomPerformer = sorted[sorted.length - 1];
    if (bottomPerformer.absoluteReturnPercent < 0) {
      insights.push({
        type: "underperformer",
        title: "Needs Review",
        value: bottomPerformer.fundName,
        subValue: `${bottomPerformer.absoluteReturnPercent}%`,
        description: `${bottomPerformer.fundName} is currently showing negative returns. Consider reviewing this investment.`,
        sentiment: "negative",
      });
    }
  }

  // Investment behavior insight
  const totalSips = fundPerformance.reduce((sum, f) => sum + f.sipCount, 0);
  const totalLumpsums = fundPerformance.reduce(
    (sum, f) => sum + f.lumpsumCount,
    0
  );

  if (totalSips > 0 && totalLumpsums > 0) {
    insights.push({
      type: "investment_style",
      title: "Investment Style",
      value: "Mixed",
      description: `You're using both SIPs (${totalSips}) and Lumpsums (${totalLumpsums}). SIPs help with rupee cost averaging.`,
      sentiment: "neutral",
    });
  } else if (totalSips > 0) {
    insights.push({
      type: "investment_style",
      title: "Investment Style",
      value: "SIP Focused",
      description: `You're disciplined with ${totalSips} active SIP(s). Great for building long-term wealth.`,
      sentiment: "positive",
    });
  }

  return insights;
}

/**
 * Build diversification-specific insights
 */
function buildDiversificationInsights(diversification) {
  const insights = [];
  const {
    assetAllocation,
    categoryDistribution,
    marketCapExposure,
    fundCount,
  } = diversification;

  // Asset allocation insight
  const dominantAsset = Object.entries(assetAllocation).sort(
    (a, b) => b[1] - a[1]
  )[0];

  if (dominantAsset) {
    insights.push({
      type: "asset_allocation",
      title: "Asset Allocation",
      value: `${dominantAsset[1]}% ${dominantAsset[0]}`,
      description: getAssetAllocationDescription(assetAllocation),
      sentiment: dominantAsset[1] > 80 ? "warning" : "neutral",
      data: assetAllocation,
    });
  }

  // Market cap exposure insight
  insights.push({
    type: "market_cap",
    title: "Market Cap Exposure",
    value: getMarketCapLabel(marketCapExposure),
    description: getMarketCapDescription(marketCapExposure),
    sentiment: "neutral",
    data: marketCapExposure,
  });

  // Category diversity
  const categoryCount = Object.keys(categoryDistribution).length;
  insights.push({
    type: "category_diversity",
    title: "Category Diversity",
    value: `${categoryCount} Categories`,
    description:
      categoryCount >= 4
        ? "Good category diversity across your portfolio."
        : "Consider diversifying across more fund categories.",
    sentiment: categoryCount >= 4 ? "positive" : "neutral",
    data: categoryDistribution,
  });

  // Fund count insight
  insights.push({
    type: "fund_count",
    title: "Portfolio Size",
    value: `${fundCount} Fund${fundCount > 1 ? "s" : ""}`,
    description: getFundCountDescription(fundCount),
    sentiment:
      fundCount >= 3 && fundCount <= 10
        ? "positive"
        : fundCount < 3
        ? "warning"
        : "neutral",
  });

  return insights;
}

/**
 * Build risk insights
 */
function buildRiskInsights(diversification, performance) {
  const insights = [];
  const { concentrationRisks, warnings } = diversification;

  // High severity risks
  const highRisks = concentrationRisks.filter((r) => r.severity === "high");
  const mediumRisks = concentrationRisks.filter((r) => r.severity === "medium");

  if (highRisks.length > 0) {
    for (const risk of highRisks) {
      insights.push({
        type: risk.type,
        severity: "high",
        title: getRiskTitle(risk),
        description: getRiskDescription(risk),
        value: `${risk.percentage}%`,
        recommendation: getRiskRecommendation(risk),
      });
    }
  }

  if (mediumRisks.length > 0) {
    for (const risk of mediumRisks) {
      insights.push({
        type: risk.type,
        severity: "medium",
        title: getRiskTitle(risk),
        description: getRiskDescription(risk),
        value: `${risk.percentage}%`,
        recommendation: getRiskRecommendation(risk),
      });
    }
  }

  // Performance-related risks
  if (performance.summary.absoluteReturnPercent < -10) {
    insights.push({
      type: "significant_loss",
      severity: "high",
      title: "Significant Portfolio Loss",
      description: `Your portfolio is down ${Math.abs(
        performance.summary.absoluteReturnPercent
      )}%. Consider reviewing your investment strategy.`,
      recommendation:
        "Review underperforming funds and consider rebalancing based on your risk tolerance.",
    });
  }

  // No risks found
  if (insights.length === 0) {
    insights.push({
      type: "no_major_risks",
      severity: "low",
      title: "No Major Risks Detected",
      description:
        "Your portfolio appears well-balanced without significant concentration risks.",
      recommendation: "Continue monitoring and rebalancing periodically.",
    });
  }

  return insights;
}

/**
 * Build recommendations
 */
function buildRecommendations(diversification, performance) {
  const recommendations = [];
  const { assetAllocation, fundCount, concentrationRisks } = diversification;
  const { summary } = performance;

  // Diversification recommendations
  if (fundCount < 3) {
    recommendations.push({
      priority: "high",
      category: "diversification",
      title: "Increase Portfolio Diversity",
      description:
        "Consider adding more funds to reduce single-fund risk. Aim for 4-8 funds across different categories.",
      action: "Add funds from different asset classes and categories.",
    });
  }

  // Asset allocation recommendations
  const equityPercent = assetAllocation["Equity"] || 0;
  const debtPercent = assetAllocation["Debt"] || 0;

  if (equityPercent > 85) {
    recommendations.push({
      priority: "medium",
      category: "allocation",
      title: "Consider Debt Allocation",
      description:
        "Your portfolio is heavily weighted towards equity. Adding debt can provide stability.",
      action:
        "Consider allocating 15-30% to debt funds for better risk management.",
    });
  }

  if (equityPercent < 50 && summary.absoluteReturnPercent < 8) {
    recommendations.push({
      priority: "low",
      category: "allocation",
      title: "Review Equity Allocation",
      description:
        "Lower equity allocation may limit long-term growth potential.",
      action:
        "If you have a long investment horizon, consider increasing equity exposure.",
    });
  }

  // Concentration recommendations
  const highConcentration = concentrationRisks.find(
    (r) => r.severity === "high"
  );
  if (highConcentration) {
    recommendations.push({
      priority: "high",
      category: "risk",
      title: "Address Concentration Risk",
      description: `High concentration detected in ${
        highConcentration.asset ||
        highConcentration.category ||
        highConcentration.fundName
      }.`,
      action: "Consider rebalancing to reduce concentration and spread risk.",
    });
  }

  // SIP recommendation
  const sipCount = performance.fundPerformance.reduce(
    (sum, f) => sum + f.sipCount,
    0
  );
  if (sipCount === 0 && fundCount > 0) {
    recommendations.push({
      priority: "medium",
      category: "investment_style",
      title: "Consider Starting SIPs",
      description:
        "SIPs help with rupee cost averaging and disciplined investing.",
      action: "Set up monthly SIPs for regular wealth accumulation.",
    });
  }

  // Sort by priority
  const priorityOrder = { high: 0, medium: 1, low: 2 };
  recommendations.sort(
    (a, b) => priorityOrder[a.priority] - priorityOrder[b.priority]
  );

  return recommendations;
}

/**
 * Build top highlights
 */
function buildHighlights(insights) {
  const highlights = [];

  // Add return highlight
  const returnInsight = insights.performance.find(
    (i) => i.type === "return_overview"
  );
  if (returnInsight) {
    highlights.push({
      icon: returnInsight.sentiment === "positive" ? "📈" : "📊",
      text: `Portfolio returns: ${returnInsight.value}`,
    });
  }

  // Add top performer
  const topPerformer = insights.performance.find(
    (i) => i.type === "top_performer"
  );
  if (topPerformer) {
    highlights.push({
      icon: "🏆",
      text: `Top performer: ${topPerformer.value} (${topPerformer.subValue})`,
    });
  }

  // Add risk warning if any
  const highRisk = insights.risks.find((r) => r.severity === "high");
  if (highRisk) {
    highlights.push({
      icon: "⚠️",
      text: highRisk.title,
    });
  } else {
    // Add diversification highlight
    const fundCountInsight = insights.diversification.find(
      (i) => i.type === "fund_count"
    );
    if (fundCountInsight) {
      highlights.push({
        icon: "📊",
        text: `${fundCountInsight.value} across your portfolio`,
      });
    }
  }

  return highlights.slice(0, 3);
}

// ═══════════════════════════════════════════════════════════════════
// Helper Functions
// ═══════════════════════════════════════════════════════════════════

function formatCurrency(amount) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(amount);
}

function getReturnDescription(returnPercent) {
  if (returnPercent >= 20)
    return "Exceptional returns! Your portfolio has significantly outperformed.";
  if (returnPercent >= 15)
    return "Excellent returns, well above market averages.";
  if (returnPercent >= 10)
    return "Good returns, in line with or above market performance.";
  if (returnPercent >= 5)
    return "Moderate returns. There may be room for optimization.";
  if (returnPercent >= 0)
    return "Minimal positive returns. Consider reviewing fund selection.";
  return "Portfolio is currently showing negative returns.";
}

function getXirrDescription(xirr) {
  if (xirr >= 15)
    return "Outstanding annualized returns, significantly beating inflation.";
  if (xirr >= 12)
    return "Strong annualized returns, well above fixed deposit rates.";
  if (xirr >= 8) return "Decent annualized returns, beating inflation.";
  if (xirr >= 5) return "Returns are modest, similar to safe fixed income.";
  return "Below-average returns on an annualized basis.";
}

function getAssetAllocationDescription(allocation) {
  const entries = Object.entries(allocation).sort((a, b) => b[1] - a[1]);
  if (entries.length === 1) {
    return `Your portfolio is entirely in ${entries[0][0]}.`;
  }
  const top2 = entries
    .slice(0, 2)
    .map((e) => `${e[0]} (${e[1]}%)`)
    .join(" and ");
  return `Primary allocation: ${top2}.`;
}

function getMarketCapLabel(marketCap) {
  const { LargeCap, MidCap, SmallCap } = marketCap;
  if (LargeCap >= 70) return "Large Cap Heavy";
  if (SmallCap >= 40) return "Small Cap Focused";
  if (MidCap >= 40) return "Mid Cap Focused";
  return "Balanced Mix";
}

function getMarketCapDescription(marketCap) {
  const { LargeCap, MidCap, SmallCap } = marketCap;
  return `Large Cap: ${LargeCap}%, Mid Cap: ${MidCap}%, Small Cap: ${SmallCap}%`;
}

function getFundCountDescription(count) {
  if (count === 1) return "Single fund portfolio. Consider diversifying.";
  if (count <= 3)
    return "Small portfolio. Adding more funds could reduce risk.";
  if (count <= 8)
    return "Well-sized portfolio with good diversification potential.";
  if (count <= 12) return "Large portfolio. Ensure each fund serves a purpose.";
  return "Very large portfolio. May be over-diversified.";
}

function getRiskTitle(risk) {
  switch (risk.type) {
    case "asset_concentration":
      return `High ${risk.asset} Concentration`;
    case "category_concentration":
      return `${risk.category} Overweight`;
    case "sector_concentration":
      return `${risk.sector} Sector Overexposure`;
    case "single_fund_dominance":
      return "Single Fund Dominance";
    default:
      return "Concentration Risk";
  }
}

function getRiskDescription(risk) {
  switch (risk.type) {
    case "asset_concentration":
      return `${risk.percentage}% of your portfolio is in ${risk.asset}. This reduces diversification benefits.`;
    case "category_concentration":
      return `${risk.percentage}% allocated to ${risk.category}. Consider spreading across categories.`;
    case "sector_concentration":
      return `${risk.percentage}% exposure to ${risk.sector} sector. Sector-specific risks are elevated.`;
    case "single_fund_dominance":
      return `${risk.fundName} represents ${risk.percentage}% of your portfolio.`;
    default:
      return "Concentration detected in your portfolio.";
  }
}

function getRiskRecommendation(risk) {
  switch (risk.type) {
    case "asset_concentration":
      return `Consider adding ${
        risk.asset === "Equity" ? "debt or gold" : "equity"
      } funds.`;
    case "category_concentration":
      return `Explore funds from different categories to balance exposure.`;
    case "sector_concentration":
      return `Look for funds with lower ${risk.sector} exposure.`;
    case "single_fund_dominance":
      return `Consider splitting investments across multiple funds.`;
    default:
      return "Review and rebalance your portfolio.";
  }
}

/**
 * Build report data structure
 * Formats data for report generation
 */
export function buildReportData(
  performance,
  diversification,
  insights,
  portfolio
) {
  return {
    generatedAt: new Date().toISOString(),
    portfolioName: portfolio.name || "My Portfolio",

    // Executive Summary
    executiveSummary: {
      totalInvested: performance.summary.totalInvested,
      currentValue: performance.summary.currentValue,
      absoluteReturn: performance.summary.absoluteReturn,
      absoluteReturnPercent: performance.summary.absoluteReturnPercent,
      xirr: performance.summary.xirr,
      fundCount: diversification.fundCount,
      healthScore: insights.summary.healthScore,
    },

    // Detailed Performance
    performanceReport: {
      summary: performance.summary,
      fundWise: performance.fundPerformance.map((f) => ({
        fundName: f.fundName,
        invested: f.totalInvested,
        currentValue: f.currentValue,
        returns: f.absoluteReturnPercent,
        xirr: f.xirr,
      })),
      period: {
        start: performance.periodStart,
        end: performance.dataAsOf,
      },
    },

    // Diversification Report
    diversificationReport: {
      assetAllocation: diversification.assetAllocation,
      categoryDistribution: diversification.categoryDistribution,
      marketCapExposure: diversification.marketCapExposure,
      sectorExposure: diversification.sectorExposure,
      risks: diversification.concentrationRisks,
    },

    // Key Insights
    keyInsights: insights.highlights,

    // Recommendations
    recommendations: insights.recommendations,

    // Warnings
    warnings: [...diversification.warnings, ...performance.warnings],
  };
}

export default {
  buildInsights,
  buildReportData,
};
