import React, { useState, useRef, useEffect, useCallback } from 'react';
import { 
  Download, Sparkles, Palette, Type, Check, 
  RotateCcw, Image as ImageIcon, Layers, Copy,
  Plus, Trash2, Move, Square, Smartphone,
  Monitor, Upload, ChevronUp, ChevronDown, 
  Wand2, Circle, ArrowRight, ArrowDown,
  FileText, ShieldCheck, Tag, X, MousePointer,
  HelpCircle, RefreshCw, Bookmark, Highlighter,
  StickyNote, MessageSquare, Lightbulb, Compass,
  Star, Spline, Sliders, Code, Layout
} from 'lucide-react';
import { jsPDF } from 'jspdf';
import { CanvasElement, ShapeType, AspectRatio, CanvasSlide } from '../../types/canvas';
import { geminiService } from '../../services/geminiService';

interface VisualWorkbenchProps {
  initialThought?: string;
  initialRole?: string;
  initialAst?: CanvasElement[];
  onApplyToStudio?: (dataUrl: string, headline: string) => void;
  onClose?: () => void;
}


// Starter templates that populate the canvas with editable blocks
const createTemplateElements = (template: string, thought: string, role: string): CanvasElement[] => {
  switch (template) {
    case 'blank':
      return [];

    // TEMPLATE 1: ORVYNIX SYSTEM WHITEBOARD (Image 2 style)
    case 'orvynix-whiteboard':
      return [
        // Brand Header
        {
          id: 'orvynix-brand',
          type: 'text',
          x: 65,
          y: 40,
          width: 600,
          height: 30,
          text: 'ORVYNIX TECHNOLOGIES  |  AI ENGINEERING · REAL SOLUTIONS',
          fontSize: 13,
          fontFamily: 'sans',
          fontWeight: 'extrabold',
          textColor: '#0F172A',
          zIndex: 1
        },
        // Giant Hook 1: THE LLM IS NOT THE PRODUCT.
        {
          id: 'hook-1',
          type: 'text',
          x: 65,
          y: 75,
          width: 1070,
          height: 55,
          text: 'THE LLM IS NOT THE PRODUCT.',
          fontSize: 44,
          fontFamily: 'display',
          fontWeight: 'extrabold',
          textColor: '#0F172A',
          zIndex: 2
        },
        // Highlighter bar behind Hook 2
        {
          id: 'highlighter-bar',
          type: 'shape',
          shapeType: 'highlighter',
          x: 60,
          y: 132,
          width: 760,
          height: 48,
          fillColor: '#FEF08A',
          opacity: 0.95,
          zIndex: 3
        },
        // Giant Hook 2: THE SYSTEM AROUND IT IS.
        {
          id: 'hook-2',
          type: 'text',
          x: 65,
          y: 130,
          width: 1070,
          height: 55,
          text: 'THE SYSTEM AROUND IT IS.',
          fontSize: 44,
          fontFamily: 'display',
          fontWeight: 'extrabold',
          textColor: '#0F172A',
          zIndex: 4
        },
        // Subtitle
        {
          id: 'hook-sub',
          type: 'text',
          x: 65,
          y: 190,
          width: 800,
          height: 30,
          text: 'Real AI Engineering goes beyond prompting.',
          fontSize: 20,
          fontFamily: 'sans',
          fontWeight: 'bold',
          textColor: '#1E3A8A',
          zIndex: 5
        },
        // Central Whiteboard Container
        {
          id: 'whiteboard-card',
          type: 'shape',
          shapeType: 'card',
          x: 100,
          y: 235,
          width: 1000,
          height: 365,
          fillColor: '#FFFFFF',
          borderColor: '#CBD5E1',
          borderWidth: 2,
          borderRadius: 20,
          shadow: true,
          zIndex: 6
        },
        // Central Intelligence Layer Hub (Dark Circle)
        {
          id: 'hub-circle',
          type: 'shape',
          shapeType: 'circle',
          x: 520,
          y: 350,
          width: 160,
          height: 160,
          fillColor: '#0F172A',
          borderColor: '#38BDF8',
          borderWidth: 3,
          borderRadius: 999,
          zIndex: 10
        },
        {
          id: 'hub-title',
          type: 'text',
          x: 535,
          y: 405,
          width: 130,
          height: 60,
          text: 'LLM\nIntelligence Layer',
          fontSize: 16,
          fontFamily: 'sans',
          fontWeight: 'extrabold',
          textColor: '#FFFFFF',
          textAlign: 'center',
          zIndex: 11
        },
        // Sticky Note 1: Context & Data (Blue)
        {
          id: 'sticky-context',
          type: 'shape',
          shapeType: 'sticky',
          x: 140,
          y: 260,
          width: 250,
          height: 140,
          fillColor: '#EFF6FF',
          borderColor: '#93C5FD',
          borderWidth: 1.5,
          borderRadius: 10,
          accentText: '📄 CONTEXT & DATA',
          zIndex: 12
        },
        {
          id: 'sticky-context-text',
          type: 'text',
          x: 155,
          y: 280,
          width: 220,
          height: 110,
          text: 'CONTEXT & DATA\nGive the model the right info:\n• Documents & DBs\n• Hybrid dense + BM25\n• Clean token boundaries',
          fontSize: 11,
          fontFamily: 'sans',
          fontWeight: 'bold',
          textColor: '#1E3A8A',
          zIndex: 13
        },
        // Sticky Note 2: Tools & APIs (Green)
        {
          id: 'sticky-tools',
          type: 'shape',
          shapeType: 'sticky',
          x: 810,
          y: 260,
          width: 250,
          height: 140,
          fillColor: '#F0FDF4',
          borderColor: '#86EFAC',
          borderWidth: 1.5,
          borderRadius: 10,
          accentText: '⚙️ TOOLS & APIs',
          zIndex: 14
        },
        {
          id: 'sticky-tools-text',
          type: 'text',
          x: 825,
          y: 280,
          width: 220,
          height: 110,
          text: 'TOOLS & APIs\nConnect to real actions:\n• Strict schema contracts\n• Business automation\n• Deterministic fallbacks',
          fontSize: 11,
          fontFamily: 'sans',
          fontWeight: 'bold',
          textColor: '#14532D',
          zIndex: 15
        },
        // Sticky Note 3: Memory & State (Amber)
        {
          id: 'sticky-memory',
          type: 'shape',
          shapeType: 'sticky',
          x: 140,
          y: 430,
          width: 250,
          height: 140,
          fillColor: '#FEFCE8',
          borderColor: '#FDE047',
          borderWidth: 1.5,
          borderRadius: 10,
          accentText: '💾 MEMORY & STATE',
          zIndex: 16
        },
        {
          id: 'sticky-memory-text',
          type: 'text',
          x: 155,
          y: 450,
          width: 220,
          height: 110,
          text: 'MEMORY & STATE\nMaintain continuity:\n• Conversation history\n• User preferences\n• Long-term persistence',
          fontSize: 11,
          fontFamily: 'sans',
          fontWeight: 'bold',
          textColor: '#854D0E',
          zIndex: 17
        },
        // Sticky Note 4: Guardrails (Pink/Red)
        {
          id: 'sticky-guard',
          type: 'shape',
          shapeType: 'sticky',
          x: 810,
          y: 430,
          width: 250,
          height: 140,
          fillColor: '#FFF1F2',
          borderColor: '#FDA4AF',
          borderWidth: 1.5,
          borderRadius: 10,
          accentText: '🛡️ GUARDRAILS',
          zIndex: 18
        },
        {
          id: 'sticky-guard-text',
          type: 'text',
          x: 825,
          y: 450,
          width: 220,
          height: 110,
          text: 'GUARDRAILS\nControl permissions:\n• PII masking & safety\n• Policy enforcement\n• Structured output schemas',
          fontSize: 11,
          fontFamily: 'sans',
          fontWeight: 'bold',
          textColor: '#9F1239',
          zIndex: 19
        },
        // Sticky Note 5: Evaluation & Monitoring (Purple)
        {
          id: 'sticky-eval',
          type: 'shape',
          shapeType: 'sticky',
          x: 475,
          y: 520,
          width: 250,
          height: 70,
          fillColor: '#FAF5FF',
          borderColor: '#D8B4FE',
          borderWidth: 1.5,
          borderRadius: 10,
          accentText: '📊 EVALUATION',
          zIndex: 20
        },
        {
          id: 'sticky-eval-text',
          type: 'text',
          x: 485,
          y: 535,
          width: 230,
          height: 45,
          text: '📊 EVALUATION & METRICS\nTrace accuracy, latency, and drift',
          fontSize: 11,
          fontFamily: 'sans',
          fontWeight: 'bold',
          textColor: '#6B21A8',
          zIndex: 21
        },
        // Bottom Authority Ribbon
        {
          id: 'orvynix-bottom',
          type: 'shape',
          shapeType: 'card',
          x: 65,
          y: 615,
          width: 1070,
          height: 45,
          fillColor: '#0F172A',
          borderColor: '#1E293B',
          borderRadius: 10,
          zIndex: 22
        },
        {
          id: 'orvynix-bottom-text',
          type: 'text',
          x: 85,
          y: 628,
          width: 1030,
          height: 25,
          text: '💡 A powerful model is just the beginning. Great AI products are engineered, not just prompted.',
          fontSize: 13,
          fontFamily: 'sans',
          fontWeight: 'bold',
          textColor: '#FEF08A',
          zIndex: 23
        }
      ];

    // TEMPLATE 2: DANDES ACADEMY 8-STAGE ROADMAP (Image 1 style)
    case 'dandes-roadmap':
      return [
        // Brand Header
        {
          id: 'dandes-logo',
          type: 'text',
          x: 65,
          y: 35,
          width: 300,
          height: 30,
          text: '🟥 DANDES ACADEMY',
          fontSize: 16,
          fontFamily: 'sans',
          fontWeight: 'extrabold',
          textColor: '#DC2626',
          zIndex: 1
        },
        {
          id: 'dandes-slogan',
          type: 'text',
          x: 900,
          y: 35,
          width: 230,
          height: 25,
          text: 'LEARN. BUILD. DEPLOY.',
          fontSize: 13,
          fontFamily: 'sans',
          fontWeight: 'extrabold',
          textColor: '#1E3A8A',
          textAlign: 'right',
          zIndex: 2
        },
        // Two-Tone Massive Title: How to Evaluate an AI Agent
        {
          id: 'dandes-title',
          type: 'text',
          x: 65,
          y: 65,
          width: 1070,
          height: 48,
          text: 'How to Evaluate an AI Agent',
          fontSize: 40,
          fontFamily: 'sans',
          fontWeight: 'extrabold',
          textColor: '#0F172A',
          zIndex: 3
        },
        {
          id: 'dandes-sub',
          type: 'text',
          x: 65,
          y: 118,
          width: 1070,
          height: 25,
          text: 'A practical, end-to-end framework to test, measure and improve AI agents before and after production.',
          fontSize: 15,
          fontFamily: 'sans',
          fontWeight: 'normal',
          textColor: '#475569',
          zIndex: 4
        },
        // 8 Numbered Framework Cards
        // Card 01: Goals (Pink)
        {
          id: 'd-card-1',
          type: 'shape',
          shapeType: 'card',
          x: 65,
          y: 155,
          width: 255,
          height: 200,
          fillColor: '#FFF1F2',
          borderColor: '#FDA4AF',
          borderWidth: 1.5,
          borderRadius: 14,
          zIndex: 5
        },
        {
          id: 'd-c1-num',
          type: 'text',
          x: 80,
          y: 170,
          width: 40,
          height: 26,
          text: '01',
          fontSize: 13,
          fontFamily: 'sans',
          fontWeight: 'extrabold',
          textColor: '#FFFFFF',
          bgColor: '#E11D48',
          zIndex: 6
        },
        {
          id: 'd-c1-title',
          type: 'text',
          x: 125,
          y: 172,
          width: 180,
          height: 40,
          text: 'Define Goals &\nSuccess Criteria',
          fontSize: 13,
          fontFamily: 'sans',
          fontWeight: 'bold',
          textColor: '#0F172A',
          zIndex: 7
        },
        {
          id: 'd-c1-body',
          type: 'text',
          x: 80,
          y: 220,
          width: 230,
          height: 120,
          text: '🎯 Task objective & scope\n👥 Target users & context\n📊 Measurable success KPIs\n⚠️ Risk & latency bounds',
          fontSize: 11,
          fontFamily: 'sans',
          fontWeight: 'normal',
          textColor: '#475569',
          zIndex: 8
        },
        // Card 02: Dataset (Orange)
        {
          id: 'd-card-2',
          type: 'shape',
          shapeType: 'card',
          x: 335,
          y: 155,
          width: 255,
          height: 200,
          fillColor: '#FFFBEB',
          borderColor: '#FDE68A',
          borderWidth: 1.5,
          borderRadius: 14,
          zIndex: 9
        },
        {
          id: 'd-c2-num',
          type: 'text',
          x: 350,
          y: 170,
          width: 40,
          height: 26,
          text: '02',
          fontSize: 13,
          fontFamily: 'sans',
          fontWeight: 'extrabold',
          textColor: '#FFFFFF',
          bgColor: '#D97706',
          zIndex: 10
        },
        {
          id: 'd-c2-title',
          type: 'text',
          x: 395,
          y: 172,
          width: 180,
          height: 40,
          text: 'Representative\nEvaluation Dataset',
          fontSize: 13,
          fontFamily: 'sans',
          fontWeight: 'bold',
          textColor: '#0F172A',
          zIndex: 11
        },
        {
          id: 'd-c2-body',
          type: 'text',
          x: 350,
          y: 220,
          width: 230,
          height: 120,
          text: '📗 Common happy paths\n⚠️ Hard edge cases\n🛑 Adversarial prompt attacks\n👤 Real production logs',
          fontSize: 11,
          fontFamily: 'sans',
          fontWeight: 'normal',
          textColor: '#475569',
          zIndex: 12
        },
        // Card 03: Run Test Cases (Blue)
        {
          id: 'd-card-3',
          type: 'shape',
          shapeType: 'card',
          x: 605,
          y: 155,
          width: 255,
          height: 200,
          fillColor: '#EFF6FF',
          borderColor: '#BFDBFE',
          borderWidth: 1.5,
          borderRadius: 14,
          zIndex: 13
        },
        {
          id: 'd-c3-num',
          type: 'text',
          x: 620,
          y: 170,
          width: 40,
          height: 26,
          text: '03',
          fontSize: 13,
          fontFamily: 'sans',
          fontWeight: 'extrabold',
          textColor: '#FFFFFF',
          bgColor: '#2563EB',
          zIndex: 14
        },
        {
          id: 'd-c3-title',
          type: 'text',
          x: 665,
          y: 172,
          width: 180,
          height: 40,
          text: 'Run the Agent on\nTest Workflows',
          fontSize: 13,
          fontFamily: 'sans',
          fontWeight: 'bold',
          textColor: '#0F172A',
          zIndex: 15
        },
        {
          id: 'd-c3-body',
          type: 'text',
          x: 620,
          y: 220,
          width: 230,
          height: 120,
          text: '💬 User input query\n🤖 AI Agent reasoning\n🔧 Tool calls & parameters\n📦 Final validated output',
          fontSize: 11,
          fontFamily: 'sans',
          fontWeight: 'normal',
          textColor: '#475569',
          zIndex: 16
        },
        // Card 04: Key Dimensions (Purple)
        {
          id: 'd-card-4',
          type: 'shape',
          shapeType: 'card',
          x: 875,
          y: 155,
          width: 260,
          height: 200,
          fillColor: '#FAF5FF',
          borderColor: '#E9D5FF',
          borderWidth: 1.5,
          borderRadius: 14,
          zIndex: 17
        },
        {
          id: 'd-c4-num',
          type: 'text',
          x: 890,
          y: 170,
          width: 40,
          height: 26,
          text: '04',
          fontSize: 13,
          fontFamily: 'sans',
          fontWeight: 'extrabold',
          textColor: '#FFFFFF',
          bgColor: '#7C3AED',
          zIndex: 18
        },
        {
          id: 'd-c4-title',
          type: 'text',
          x: 935,
          y: 172,
          width: 190,
          height: 40,
          text: 'Evaluate Key\nDimensions',
          fontSize: 13,
          fontFamily: 'sans',
          fontWeight: 'bold',
          textColor: '#0F172A',
          zIndex: 19
        },
        {
          id: 'd-c4-body',
          type: 'text',
          x: 890,
          y: 220,
          width: 230,
          height: 120,
          text: '✅ Task success rate (%)\n🛠️ Tool call schema precision\n⏱️ Latency & token cost\n🛡️ Safety & compliance',
          fontSize: 11,
          fontFamily: 'sans',
          fontWeight: 'normal',
          textColor: '#475569',
          zIndex: 20
        },
        // Row 2: Cards 05 to 08
        // Card 05: Analyze Failures (Green)
        {
          id: 'd-card-5',
          type: 'shape',
          shapeType: 'card',
          x: 65,
          y: 370,
          width: 255,
          height: 195,
          fillColor: '#F0FDF4',
          borderColor: '#BBF7D0',
          borderWidth: 1.5,
          borderRadius: 14,
          zIndex: 21
        },
        {
          id: 'd-c5-num',
          type: 'text',
          x: 80,
          y: 385,
          width: 40,
          height: 26,
          text: '05',
          fontSize: 13,
          fontFamily: 'sans',
          fontWeight: 'extrabold',
          textColor: '#FFFFFF',
          bgColor: '#16A34A',
          zIndex: 22
        },
        {
          id: 'd-c5-title',
          type: 'text',
          x: 125,
          y: 387,
          width: 180,
          height: 40,
          text: 'Analyze Root Cause\nFailures',
          fontSize: 13,
          fontFamily: 'sans',
          fontWeight: 'bold',
          textColor: '#0F172A',
          zIndex: 23
        },
        {
          id: 'd-c5-body',
          type: 'text',
          x: 80,
          y: 435,
          width: 230,
          height: 120,
          text: '❌ Hallucinated answers\n🔧 Tool argument mismatch\n🔄 Infinite looping\n⚠️ Context window overflow',
          fontSize: 11,
          fontFamily: 'sans',
          fontWeight: 'normal',
          textColor: '#475569',
          zIndex: 24
        },
        // Card 06: Iterate (Cyan)
        {
          id: 'd-card-6',
          type: 'shape',
          shapeType: 'card',
          x: 335,
          y: 370,
          width: 255,
          height: 195,
          fillColor: '#ECFEFF',
          borderColor: '#A5F3FC',
          borderWidth: 1.5,
          borderRadius: 14,
          zIndex: 25
        },
        {
          id: 'd-c6-num',
          type: 'text',
          x: 350,
          y: 385,
          width: 40,
          height: 26,
          text: '06',
          fontSize: 13,
          fontFamily: 'sans',
          fontWeight: 'extrabold',
          textColor: '#FFFFFF',
          bgColor: '#0891B2',
          zIndex: 26
        },
        {
          id: 'd-c6-title',
          type: 'text',
          x: 395,
          y: 387,
          width: 180,
          height: 40,
          text: 'Iterate Guardrails\n& Architecture',
          fontSize: 13,
          fontFamily: 'sans',
          fontWeight: 'bold',
          textColor: '#0F172A',
          zIndex: 27
        },
        {
          id: 'd-c6-body',
          type: 'text',
          x: 350,
          y: 435,
          width: 230,
          height: 120,
          text: '📝 System prompt updates\n🛡️ Deterministic filters\n🔄 Automatic schema retry\n📈 Regression test suites',
          fontSize: 11,
          fontFamily: 'sans',
          fontWeight: 'normal',
          textColor: '#475569',
          zIndex: 28
        },
        // Card 07: Reliability (Amber/Orange)
        {
          id: 'd-card-7',
          type: 'shape',
          shapeType: 'card',
          x: 605,
          y: 370,
          width: 255,
          height: 195,
          fillColor: '#FFF7ED',
          borderColor: '#FED7AA',
          borderWidth: 1.5,
          borderRadius: 14,
          zIndex: 29
        },
        {
          id: 'd-c7-num',
          type: 'text',
          x: 620,
          y: 385,
          width: 40,
          height: 26,
          text: '07',
          fontSize: 13,
          fontFamily: 'sans',
          fontWeight: 'extrabold',
          textColor: '#FFFFFF',
          bgColor: '#EA580C',
          zIndex: 30
        },
        {
          id: 'd-c7-title',
          type: 'text',
          x: 665,
          y: 387,
          width: 180,
          height: 40,
          text: 'Test for Reliability\n& Multi-Run Variance',
          fontSize: 13,
          fontFamily: 'sans',
          fontWeight: 'bold',
          textColor: '#0F172A',
          zIndex: 31
        },
        {
          id: 'd-c7-body',
          type: 'text',
          x: 620,
          y: 435,
          width: 230,
          height: 120,
          text: '🔁 Run identical suite 5x\n📊 Measure pass/fail spread\n🛡️ Lock temperature & seed\n🔒 Prevent silent regressions',
          fontSize: 11,
          fontFamily: 'sans',
          fontWeight: 'normal',
          textColor: '#475569',
          zIndex: 32
        },
        // Card 08: Production Monitor (Yellow)
        {
          id: 'd-card-8',
          type: 'shape',
          shapeType: 'card',
          x: 875,
          y: 370,
          width: 260,
          height: 195,
          fillColor: '#FEFCE8',
          borderColor: '#FEF08A',
          borderWidth: 1.5,
          borderRadius: 14,
          zIndex: 33
        },
        {
          id: 'd-c8-num',
          type: 'text',
          x: 890,
          y: 385,
          width: 40,
          height: 26,
          text: '08',
          fontSize: 13,
          fontFamily: 'sans',
          fontWeight: 'extrabold',
          textColor: '#FFFFFF',
          bgColor: '#CA8A04',
          zIndex: 34
        },
        {
          id: 'd-c8-title',
          type: 'text',
          x: 935,
          y: 387,
          width: 190,
          height: 40,
          text: 'Monitor Drift in\nReal Production',
          fontSize: 13,
          fontFamily: 'sans',
          fontWeight: 'bold',
          textColor: '#0F172A',
          zIndex: 35
        },
        {
          id: 'd-c8-body',
          type: 'text',
          x: 890,
          y: 435,
          width: 230,
          height: 120,
          text: '🚨 Live anomaly alerts\n👥 User thumbs up/down\n📈 Cost & token telemetry\n🔄 Continuous evaluation loop',
          fontSize: 11,
          fontFamily: 'sans',
          fontWeight: 'normal',
          textColor: '#475569',
          zIndex: 36
        },
        // Key Takeaway Footer Banner (Identical to Dandes Academy)
        {
          id: 'dandes-footer',
          type: 'shape',
          shapeType: 'takeaway-bar',
          x: 65,
          y: 585,
          width: 1070,
          height: 75,
          fillColor: '#FFFFFF',
          borderColor: '#E2E8F0',
          borderWidth: 1.5,
          borderRadius: 12,
          shadow: true,
          zIndex: 37
        },
        {
          id: 'dandes-footer-badge',
          type: 'text',
          x: 85,
          y: 610,
          width: 160,
          height: 30,
          text: '💡 Key Takeaway',
          fontSize: 15,
          fontFamily: 'sans',
          fontWeight: 'extrabold',
          textColor: '#DC2626',
          zIndex: 38
        },
        {
          id: 'dandes-footer-quote',
          type: 'text',
          x: 260,
          y: 605,
          width: 520,
          height: 45,
          text: 'Evaluating an AI agent is not a one-time test. It is a continuous discipline.\nTrust is earned call by call.',
          fontSize: 12,
          fontFamily: 'sans',
          fontWeight: 'bold',
          textColor: '#0F172A',
          zIndex: 39
        },
        {
          id: 'dandes-footer-metrics',
          type: 'text',
          x: 800,
          y: 615,
          width: 320,
          height: 25,
          text: '🛡️ Lower risk  ·  ⚡ Better speed  ·  🎯 Real value',
          fontSize: 11,
          fontFamily: 'sans',
          fontWeight: 'extrabold',
          textColor: '#2563EB',
          zIndex: 40
        }
      ];

    case 'cheatsheet':
      return [
        {
          id: 'badge-1',
          type: 'text',
          x: 65,
          y: 60,
          width: 320,
          height: 32,
          text: '⚡ PYTHON 3.12 CHEATSHEET',
          fontSize: 13,
          fontFamily: 'mono',
          fontWeight: 'bold',
          textColor: '#38BDF8',
          zIndex: 1
        },
        {
          id: 'head-1',
          type: 'text',
          x: 65,
          y: 95,
          width: 1070,
          height: 50,
          text: thought || 'Python Advanced Patterns',
          fontSize: 36,
          fontFamily: 'sans',
          fontWeight: 'extrabold',
          textColor: '#FFFFFF',
          zIndex: 2
        },
        {
          id: 'sub-1',
          type: 'text',
          x: 65,
          y: 150,
          width: 1070,
          height: 30,
          text: 'A clean reference guide for modern production codebases.',
          fontSize: 16,
          fontFamily: 'sans',
          fontWeight: 'normal',
          textColor: '#94A3B8',
          zIndex: 3
        },
        // 3 Cards
        {
          id: 'card-1',
          type: 'shape',
          shapeType: 'card',
          x: 65,
          y: 205,
          width: 340,
          height: 380,
          fillColor: '#1E293B',
          borderColor: '#334155',
          borderWidth: 1.5,
          borderRadius: 16,
          zIndex: 4
        },
        {
          id: 'card-1-title',
          type: 'text',
          x: 90,
          y: 225,
          width: 290,
          height: 30,
          text: '1. Generic Type Syntax',
          fontSize: 16,
          fontFamily: 'sans',
          fontWeight: 'bold',
          textColor: '#FFFFFF',
          zIndex: 5
        },
        {
          id: 'card-1-code',
          type: 'text',
          x: 90,
          y: 270,
          width: 290,
          height: 180,
          text: 'type User[T] = dict[str, T]\n\ndef run[T](data: T) -> T:\n    return process(data)\n\n# Clean generic typing',
          fontSize: 12,
          fontFamily: 'mono',
          fontWeight: 'normal',
          textColor: '#38BDF8',
          bgColor: 'rgba(0,0,0,0.3)',
          zIndex: 6
        },
        {
          id: 'card-2',
          type: 'shape',
          shapeType: 'card',
          x: 430,
          y: 205,
          width: 340,
          height: 380,
          fillColor: '#1E293B',
          borderColor: '#334155',
          borderWidth: 1.5,
          borderRadius: 16,
          zIndex: 7
        },
        {
          id: 'card-2-title',
          type: 'text',
          x: 455,
          y: 225,
          width: 290,
          height: 30,
          text: '2. Expression Freedom',
          fontSize: 16,
          fontFamily: 'sans',
          fontWeight: 'bold',
          textColor: '#FFFFFF',
          zIndex: 8
        },
        {
          id: 'card-2-code',
          type: 'text',
          x: 455,
          y: 270,
          width: 290,
          height: 180,
          text: '# Unrestricted f-strings\nf"Hex: {\':\'.join(f\'{x:02x}\')}"\n\nf"Query: {db[\'user\'][\'id\']}"',
          fontSize: 12,
          fontFamily: 'mono',
          fontWeight: 'normal',
          textColor: '#38BDF8',
          bgColor: 'rgba(0,0,0,0.3)',
          zIndex: 9
        },
        {
          id: 'card-3',
          type: 'shape',
          shapeType: 'card',
          x: 795,
          y: 205,
          width: 340,
          height: 380,
          fillColor: '#1E293B',
          borderColor: '#334155',
          borderWidth: 1.5,
          borderRadius: 16,
          zIndex: 10
        },
        {
          id: 'card-3-title',
          type: 'text',
          x: 820,
          y: 225,
          width: 290,
          height: 30,
          text: '3. Multi-Core Scaling',
          fontSize: 16,
          fontFamily: 'sans',
          fontWeight: 'bold',
          textColor: '#FFFFFF',
          zIndex: 11
        },
        {
          id: 'card-3-code',
          type: 'text',
          x: 820,
          y: 270,
          width: 290,
          height: 180,
          text: 'import _xxsubinterpreters\ninterp = interp_create()\ninterp_run(interp, task)\n\n# Per-interpreter GIL scale',
          fontSize: 12,
          fontFamily: 'mono',
          fontWeight: 'normal',
          textColor: '#38BDF8',
          bgColor: 'rgba(0,0,0,0.3)',
          zIndex: 12
        },
        {
          id: 'brand-stamp',
          type: 'text',
          x: 65,
          y: 620,
          width: 400,
          height: 25,
          text: 'postmark / studio · Executive Tech Guide',
          fontSize: 12,
          fontFamily: 'sans',
          fontWeight: 'bold',
          textColor: '#38BDF8',
          zIndex: 13
        }
      ];

    // TEMPLATE: 4-STAGE PRODUCTION RAG PIPELINE
    case 'rag-pipeline':
      return [
        {
          id: 'rag-badge',
          type: 'shape',
          shapeType: 'pill',
          x: 60,
          y: 40,
          width: 260,
          height: 34,
          fillColor: '#1F322C',
          textColor: '#FFFFFF',
          accentText: '⚡ PRODUCTION RAG PIPELINE',
          borderRadius: 17,
          zIndex: 1
        },
        {
          id: 'rag-title',
          type: 'text',
          x: 60,
          y: 90,
          width: 950,
          height: 48,
          text: 'How Production RAG Actually Works in 2026',
          fontSize: 34,
          fontFamily: 'sans',
          fontWeight: 'extrabold',
          textColor: '#1F322C',
          zIndex: 2
        },
        {
          id: 'rag-sub',
          type: 'text',
          x: 60,
          y: 145,
          width: 900,
          height: 25,
          text: 'Moving past naive cosine similarity: Hybrid search, cross-rerank & strict ground truth.',
          fontSize: 15,
          fontFamily: 'sans',
          fontWeight: 'normal',
          textColor: '#5A6F64',
          zIndex: 2
        },
        // Step 1
        {
          id: 'rag-c1',
          type: 'shape',
          shapeType: 'card',
          x: 60,
          y: 190,
          width: 250,
          height: 255,
          fillColor: '#FFFFFF',
          borderColor: '#3E6F58',
          borderWidth: 2,
          borderRadius: 16,
          accentText: '01. CHUNKING & EMBED',
          text: '• Semantic header splitting\n• 512 token chunk overlap\n• Domain vector models\n• Metadata ACL tags',
          zIndex: 3
        },
        // Arrow 1 -> 2
        {
          id: 'rag-arr-1',
          type: 'shape',
          shapeType: 'arrow',
          x: 320,
          y: 305,
          width: 24,
          height: 18,
          fillColor: '#3E6F58',
          zIndex: 4
        },
        // Step 2
        {
          id: 'rag-c2',
          type: 'shape',
          shapeType: 'card',
          x: 355,
          y: 190,
          width: 250,
          height: 255,
          fillColor: '#FFFFFF',
          borderColor: '#3E6F58',
          borderWidth: 2,
          borderRadius: 16,
          accentText: '02. HYBRID INDEX',
          text: '• Dense: HNSW vector search\n• Sparse: BM25 exact keyword\n• Reciprocal Rank Fusion (RRF)\n• pgvector / Qdrant store',
          zIndex: 3
        },
        // Arrow 2 -> 3
        {
          id: 'rag-arr-2',
          type: 'shape',
          shapeType: 'arrow',
          x: 615,
          y: 305,
          width: 24,
          height: 18,
          fillColor: '#3E6F58',
          zIndex: 4
        },
        // Step 3
        {
          id: 'rag-c3',
          type: 'shape',
          shapeType: 'card',
          x: 650,
          y: 190,
          width: 250,
          height: 255,
          fillColor: '#FFFFFF',
          borderColor: '#3E6F58',
          borderWidth: 2,
          borderRadius: 16,
          accentText: '03. CROSS-RERANKER',
          text: '• Top 30 candidate chunks\n• Cross-encoder attention\n• Eliminates noise & drift\n• Top 5 high-precision bits',
          zIndex: 3
        },
        // Arrow 3 -> 4
        {
          id: 'rag-arr-3',
          type: 'shape',
          shapeType: 'arrow',
          x: 910,
          y: 305,
          width: 24,
          height: 18,
          fillColor: '#3E6F58',
          zIndex: 4
        },
        // Step 4
        {
          id: 'rag-c4',
          type: 'shape',
          shapeType: 'card',
          x: 945,
          y: 190,
          width: 250,
          height: 255,
          fillColor: '#FFFFFF',
          borderColor: '#3E6F58',
          borderWidth: 2,
          borderRadius: 16,
          accentText: '04. GROUNDED LLM',
          text: '• Strict context injection\n• Hallucination filters\n• Source citation badges\n• P95 latency < 1.1s',
          zIndex: 3
        },
        // Takeaway
        {
          id: 'rag-takeaway',
          type: 'shape',
          shapeType: 'takeaway-bar',
          x: 60,
          y: 475,
          width: 1135,
          height: 60,
          fillColor: '#1F322C',
          textColor: '#FFFFFF',
          accentText: '💡 KEY TAKEAWAY: The model is only 10% of the architecture. The retrieval & reranking pipeline is the actual moat.',
          borderRadius: 12,
          zIndex: 5
        },
        {
          id: 'rag-watermark',
          type: 'text',
          x: 60,
          y: 560,
          width: 500,
          height: 25,
          text: `${role || 'AI Systems Architect'} · Modern Retrieval Field Notes`,
          fontSize: 13,
          fontFamily: 'mono',
          fontWeight: 'bold',
          textColor: '#3E6F58',
          zIndex: 5
        }
      ];

    // TEMPLATE: 2x2 DECISION MATRIX / COMPARISON
    case 'decision-matrix':
      return [
        {
          id: 'dm-badge',
          type: 'shape',
          shapeType: 'pill',
          x: 60,
          y: 35,
          width: 250,
          height: 32,
          fillColor: '#DC2626',
          textColor: '#FFFFFF',
          accentText: '⚖️ ARCHITECTURAL COMPARISON',
          borderRadius: 16,
          zIndex: 1
        },
        {
          id: 'dm-title',
          type: 'text',
          x: 60,
          y: 80,
          width: 950,
          height: 48,
          text: 'Amateur Approaches vs. Production Systems',
          fontSize: 34,
          fontFamily: 'sans',
          fontWeight: 'extrabold',
          textColor: '#0F172A',
          zIndex: 2
        },
        // Left Column (Amateur / Red)
        {
          id: 'dm-left-card',
          type: 'shape',
          shapeType: 'card',
          x: 60,
          y: 150,
          width: 520,
          height: 380,
          fillColor: '#FFF1F2',
          borderColor: '#FECDD3',
          borderWidth: 2,
          borderRadius: 18,
          accentText: '❌ AMATEUR APPROACH (WHY PILOTS FAIL)',
          text: '• Prompt-engineering in isolation with no evals\n• Assuming cosine similarity equals semantic truth\n• Storing unchunked, messy PDFs with no metadata\n• Unbounded token windows causing latency explosions\n• Zero regression testing before pushing prompt tweaks',
          zIndex: 3
        },
        // Right Column (Production / Green)
        {
          id: 'dm-right-card',
          type: 'shape',
          shapeType: 'card',
          x: 620,
          y: 150,
          width: 520,
          height: 380,
          fillColor: '#F0FDF4',
          borderColor: '#BBF7D0',
          borderWidth: 2,
          borderRadius: 18,
          accentText: '✅ PRODUCTION GRADE (HOW TOP 1% BUILD)',
          text: '• End-to-end continuous regression test suites\n• Hybrid search (Dense HNSW + Sparse BM25)\n• Cross-encoder rerankers on candidate chunks\n• Hard cost, token, and latency budgets per call\n• Production drift monitoring with anomaly alerts',
          zIndex: 3
        },
        // Summary bar
        {
          id: 'dm-summary',
          type: 'shape',
          shapeType: 'takeaway-bar',
          x: 60,
          y: 555,
          width: 1080,
          height: 55,
          fillColor: '#0F172A',
          textColor: '#FFFFFF',
          accentText: '🎯 VERDICT: Complexity is where teams hide. Simplicity and evals are where products succeed.',
          borderRadius: 12,
          zIndex: 4
        }
      ];

    case 'quote':
    default:

      return [
        {
          id: 'quote-card',
          type: 'shape',
          shapeType: 'card',
          x: 80,
          y: 80,
          width: 1040,
          height: 515,
          fillColor: '#1F3429',
          borderColor: '#2E4C3C',
          borderWidth: 2,
          borderRadius: 24,
          zIndex: 1
        },
        {
          id: 'quote-badge',
          type: 'text',
          x: 140,
          y: 130,
          width: 400,
          height: 30,
          text: '💡 EXECUTIVE PERSPECTIVE',
          fontSize: 13,
          fontFamily: 'sans',
          fontWeight: 'bold',
          textColor: '#4ADE80',
          zIndex: 2
        },
        {
          id: 'quote-mark',
          type: 'text',
          x: 135,
          y: 165,
          width: 80,
          height: 80,
          text: '“',
          fontSize: 90,
          fontFamily: 'serif',
          fontWeight: 'extrabold',
          textColor: '#4ADE80',
          zIndex: 3
        },
        {
          id: 'quote-text',
          type: 'text',
          x: 140,
          y: 260,
          width: 920,
          height: 120,
          text: `"${thought || 'Great engineering is rarely about complexity. It is about making the non-obvious simple.'}"`,
          fontSize: 34,
          fontFamily: 'sans',
          fontWeight: 'extrabold',
          textColor: '#FFFFFF',
          zIndex: 4
        },
        {
          id: 'author-name',
          type: 'text',
          x: 140,
          y: 450,
          width: 400,
          height: 30,
          text: 'Alexandre Renard',
          fontSize: 20,
          fontFamily: 'sans',
          fontWeight: 'bold',
          textColor: '#FFFFFF',
          zIndex: 5
        },
        {
          id: 'author-role',
          type: 'text',
          x: 140,
          y: 485,
          width: 500,
          height: 25,
          text: `${role || 'Principal Systems Architect'} · @alexandre_arch`,
          fontSize: 14,
          fontFamily: 'sans',
          fontWeight: 'normal',
          textColor: '#9CB797',
          zIndex: 6
        }
      ];
  }
};

export const VisualWorkbench: React.FC<VisualWorkbenchProps> = ({
  initialThought = 'How to Evaluate an AI Agent',
  initialRole = 'AI Systems Architect',
  initialAst,
  onApplyToStudio,
  onClose
}) => {
  // Canvas configuration
  const [aspectRatio, setAspectRatio] = useState<AspectRatio>('16:9');
  const [bgColor, setBgColor] = useState<string>('#FFFFFF');
  const [bgTexture, setBgTexture] = useState<'solid' | 'grid' | 'dots' | 'glow'>('solid');
  const [bgImageUrl, setBgImageUrl] = useState<string>('');

  // Initial Elements - Starts completely clean whiteboard without any templates or blueprints
  const initialElements: CanvasElement[] = [];

  // Multi-Slide Carousel Management
  const [slides, setSlides] = useState<CanvasSlide[]>([
    {
      id: 'slide-1',
      title: 'Slide 1 (Hook & Core)',
      elements: initialElements
    }
  ]);
  const [currentSlideIdx, setCurrentSlideIdx] = useState<number>(0);

  // Active slide elements
  const [elements, setElements] = useState<CanvasElement[]>(initialElements);

  // Keep active slide elements synchronized
  const syncElementsToCurrentSlide = (newEls: CanvasElement[]) => {
    setElements(newEls);
    setSlides(prev => prev.map((s, idx) => idx === currentSlideIdx ? { ...s, elements: newEls } : s));
  };

  // Selection & drag state
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [dragOffset, setDragOffset] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [isResizing, setIsResizing] = useState<boolean>(false);
  const [resizeHandle, setResizeHandle] = useState<string | null>(null);
  const [initialResize, setInitialResize] = useState<{ x: number; y: number; w: number; h: number }>({ x: 0, y: 0, w: 0, h: 0 });

  // History for Undo / Redo
  const [history, setHistory] = useState<CanvasElement[][]>([]);
  const [historyIndex, setHistoryIndex] = useState<number>(-1);

  // Local Clipboard for Copy / Paste
  const [clipboard, setClipboard] = useState<CanvasElement | null>(null);

  // Active Tool Panel ('shapes' | 'add' | 'images' | 'properties')
  const [activeTool, setActiveTool] = useState<'shapes' | 'add' | 'images' | 'properties'>('shapes');

  // Export State
  const [isExporting, setIsExporting] = useState<boolean>(false);
  const [downloadSuccess, setDownloadSuccess] = useState<boolean>(false);
  const [copySuccess, setCopySuccess] = useState<boolean>(false);
  const [pdfSuccess, setPdfSuccess] = useState<boolean>(false);


  // AI image generation
  const [isGeneratingAi, setIsGeneratingAi] = useState<boolean>(false);

  // File upload input ref
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const canvasContainerRef = useRef<HTMLDivElement | null>(null);

  // Canvas coordinate dimensions
  const getCanvasDims = useCallback((): { width: number; height: number } => {
    switch (aspectRatio) {
      case '1:1':
        return { width: 1080, height: 1080 };
      case '4:5':
        return { width: 1080, height: 1350 };
      case '16:9':
      default:
        return { width: 1200, height: 675 };
    }
  }, [aspectRatio]);

  const { width: canvasWidth, height: canvasHeight } = getCanvasDims();

  // Save state to undo history
  const pushHistory = (newElements: CanvasElement[]) => {
    const updated = history.slice(0, historyIndex + 1);
    updated.push(newElements);
    if (updated.length > 20) updated.shift();
    setHistory(updated);
    setHistoryIndex(updated.length - 1);
  };

  const handleUndo = () => {
    if (historyIndex > 0) {
      const prev = history[historyIndex - 1];
      setElements(prev);
      setHistoryIndex(historyIndex - 1);
    }
  };

  const selectedElement = elements.find(el => el.id === selectedId) || null;

  // Update selected element property
  const updateSelected = (updates: Partial<CanvasElement>) => {
    if (!selectedId) return;
    setElements(prev => {
      const next = prev.map(el => el.id === selectedId ? { ...el, ...updates } : el);
      setSlides(sPrev => sPrev.map((s, idx) => idx === currentSlideIdx ? { ...s, elements: next } : s));
      return next;
    });
  };

  // Add new element and keep it firmly selected and visible
  const addElement = (newEl: CanvasElement) => {
    // Ensure element has visible contrast against white canvas
    const safeEl: CanvasElement = { ...newEl };
    if (safeEl.type === 'shape') {
      if (!safeEl.borderWidth || safeEl.borderWidth === 0) {
        safeEl.borderWidth = 1.5;
        safeEl.borderColor = safeEl.borderColor || '#CBD5E1';
      }
    } else if (safeEl.type === 'text') {
      if (!safeEl.textColor || safeEl.textColor === '#FFFFFF' || safeEl.textColor === '#fff') {
        safeEl.textColor = '#0F172A';
      }
    }

    setElements(prev => {
      const next = [...prev, safeEl];
      pushHistory(next);
      setSlides(sPrev => sPrev.map((s, idx) => idx === currentSlideIdx ? { ...s, elements: next } : s));
      return next;
    });
    setSelectedId(safeEl.id);
    setActiveTool('properties');
  };

  // Delete selected element
  const handleDeleteSelected = useCallback(() => {
    if (!selectedId) return;
    setElements(prev => {
      const next = prev.filter(el => el.id !== selectedId);
      pushHistory(next);
      setSlides(sPrev => sPrev.map((s, idx) => idx === currentSlideIdx ? { ...s, elements: next } : s));
      return next;
    });
    setSelectedId(null);
  }, [selectedId, currentSlideIdx]);

  // Duplicate selected element
  const handleDuplicateSelected = useCallback(() => {
    if (!selectedElement) return;
    const maxZ = elements.reduce((max, el) => Math.max(max, el.zIndex), 0);
    const dup: CanvasElement = {
      ...selectedElement,
      id: `${selectedElement.type}-${Date.now()}`,
      x: Math.min(canvasWidth - 100, selectedElement.x + 25),
      y: Math.min(canvasHeight - 60, selectedElement.y + 25),
      zIndex: maxZ + 1
    };
    addElement(dup);
  }, [selectedElement, elements, canvasWidth, canvasHeight]);

  // Keyboard Shortcuts: Delete, Copy, Paste, Duplicate
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const targetTag = (e.target as HTMLElement)?.tagName;
      if (targetTag === 'INPUT' || targetTag === 'TEXTAREA') {
        return;
      }

      if (e.key === 'Delete' || e.key === 'Backspace') {
        if (selectedId) {
          e.preventDefault();
          handleDeleteSelected();
        }
      } else if ((e.ctrlKey || e.metaKey) && e.key === 'c') {
        if (selectedElement) {
          e.preventDefault();
          setClipboard(selectedElement);
        }
      } else if ((e.ctrlKey || e.metaKey) && e.key === 'v') {
        if (clipboard) {
          e.preventDefault();
          const maxZ = elements.reduce((max, el) => Math.max(max, el.zIndex), 0);
          const pasted: CanvasElement = {
            ...clipboard,
            id: `${clipboard.type}-${Date.now()}`,
            x: Math.min(canvasWidth - 100, clipboard.x + 30),
            y: Math.min(canvasHeight - 60, clipboard.y + 30),
            zIndex: maxZ + 1
          };
          addElement(pasted);
        }
      } else if ((e.ctrlKey || e.metaKey) && e.key === 'd') {
        if (selectedElement) {
          e.preventDefault();
          handleDuplicateSelected();
        }
      } else if (e.key === 'Escape') {
        setSelectedId(null);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedId, selectedElement, clipboard, elements, canvasWidth, canvasHeight, handleDeleteSelected, handleDuplicateSelected]);

  // Clear Canvas (Start with clean canvas)
  const handleClearCanvas = () => {
    setElements([]);
    pushHistory([]);
    setSelectedId(null);
  };

  // Layer ordering
  const handleBringToFront = () => {
    if (!selectedId) return;
    const maxZ = elements.reduce((max, el) => Math.max(max, el.zIndex), 0);
    updateSelected({ zIndex: maxZ + 1 });
  };

  const handleSendToBack = () => {
    if (!selectedId) return;
    const minZ = elements.reduce((min, el) => Math.min(min, el.zIndex), 0);
    updateSelected({ zIndex: Math.max(0, minZ - 1) });
  };

  // ADD TEXT BLOCK
  const handleAddText = (type: 'headline' | 'subtitle' | 'body' | 'code' | 'badge') => {
    const maxZ = elements.reduce((max, el) => Math.max(max, el.zIndex), 0);
    let el: CanvasElement;

    if (type === 'headline') {
      el = {
        id: `text-${Date.now()}`,
        type: 'text',
        x: 100,
        y: 100,
        width: 800,
        height: 60,
        text: 'New Bold Headline',
        fontSize: 38,
        fontFamily: 'sans',
        fontWeight: 'extrabold',
        textColor: '#0F172A',
        zIndex: maxZ + 1
      };
    } else if (type === 'subtitle') {
      el = {
        id: `text-${Date.now()}`,
        type: 'text',
        x: 100,
        y: 170,
        width: 700,
        height: 40,
        text: 'A practical framework to test, measure and improve in production.',
        fontSize: 16,
        fontFamily: 'sans',
        fontWeight: 'normal',
        textColor: '#475569',
        zIndex: maxZ + 1
      };
    } else if (type === 'code') {
      el = {
        id: `code-${Date.now()}`,
        type: 'text',
        x: 100,
        y: 240,
        width: 480,
        height: 140,
        text: 'agent.run_evaluation(dataset, tools=schema)',
        fontSize: 13,
        fontFamily: 'mono',
        fontWeight: 'normal',
        textColor: '#38BDF8',
        bgColor: '#0F172A',
        zIndex: maxZ + 1
      };
    } else if (type === 'badge') {
      el = {
        id: `badge-${Date.now()}`,
        type: 'text',
        x: 100,
        y: 60,
        width: 220,
        height: 30,
        text: '⚡ EVALUATION HARNESS',
        fontSize: 12,
        fontFamily: 'sans',
        fontWeight: 'extrabold',
        textColor: '#FFFFFF',
        bgColor: '#DC2626',
        zIndex: maxZ + 1
      };
    } else {
      el = {
        id: `body-${Date.now()}`,
        type: 'text',
        x: 100,
        y: 220,
        width: 500,
        height: 80,
        text: '• Point 1: Define baseline\n• Point 2: Measure failure drift\n• Point 3: Retest continuously',
        fontSize: 14,
        fontFamily: 'sans',
        fontWeight: 'normal',
        textColor: '#334155',
        zIndex: maxZ + 1
      };
    }

    addElement(el);
  };

  // ADD CODE BLOCK
  const handleAddCodeBlock = (language: string = 'python') => {
    const maxZ = elements.reduce((max, el) => Math.max(max, el.zIndex), 0);
    const codeEl: CanvasElement = {
      id: `code-${Date.now()}`,
      type: 'code',
      x: 150,
      y: 180,
      width: 420,
      height: 220,
      accentText: language === 'python' ? '01. PYTHON IDIOM' : '01. TYPESCRIPT PATTERN',
      codeLanguage: language,
      codeText: language === 'python'
        ? `from dataclasses import dataclass\n\n@dataclass(slots=True)\nclass AgentState:\n    memory: list[dict]\n    step_count: int\n    latency_ms: float\n# 2x memory reduction in Python 3.12+`
        : `interface AgentPacket {\n  id: string;\n  status: 'running' | 'halted';\n  payload: Record<string, unknown>;\n}`,
      fillColor: '#0F172A',
      textColor: '#F8FAFC',
      borderRadius: 14,
      zIndex: maxZ + 1
    };
    addElement(codeEl);
  };


  // ADD NEW SHAPES (EXPANDED TO ALL REQUESTED SHAPES)
  const handleAddShape = (shapeType: ShapeType, colorPreset?: string) => {
    const maxZ = elements.reduce((max, el) => Math.max(max, el.zIndex), 0);
    let el: CanvasElement;

    switch (shapeType) {
      // 1. STICKY NOTE (Orvynix style)
      case 'sticky': {
        const bg = colorPreset || '#FEFCE8';
        const border = colorPreset === '#EFF6FF' ? '#93C5FD' : colorPreset === '#F0FDF4' ? '#86EFAC' : colorPreset === '#FFF1F2' ? '#FDA4AF' : '#FDE047';
        el = {
          id: `sticky-${Date.now()}`,
          type: 'shape',
          shapeType: 'sticky',
          x: 200,
          y: 200,
          width: 240,
          height: 140,
          fillColor: bg,
          borderColor: border,
          borderWidth: 1.5,
          borderRadius: 10,
          accentText: '📌 STICKY NOTE',
          shadow: true,
          zIndex: maxZ + 1
        };
        break;
      }

      // 2. HIGHLIGHTER ACCENT BAR (Orvynix style behind titles)
      case 'highlighter': {
        el = {
          id: `highlighter-${Date.now()}`,
          type: 'shape',
          shapeType: 'highlighter',
          x: 100,
          y: 120,
          width: 480,
          height: 42,
          fillColor: colorPreset || '#FEF08A',
          opacity: 0.9,
          borderRadius: 6,
          zIndex: maxZ + 1
        };
        break;
      }

      // 3. KEY TAKEAWAY FOOTER BAR (Dandes Academy style)
      case 'takeaway-bar': {
        el = {
          id: `takeaway-${Date.now()}`,
          type: 'shape',
          shapeType: 'takeaway-bar',
          x: 65,
          y: 580,
          width: 1070,
          height: 75,
          fillColor: '#FFFFFF',
          borderColor: '#E2E8F0',
          borderWidth: 1.5,
          borderRadius: 12,
          shadow: true,
          zIndex: maxZ + 1
        };
        break;
      }

      // 4. CIRCLE / INTELLIGENCE HUB NODE
      case 'circle': {
        el = {
          id: `circle-${Date.now()}`,
          type: 'shape',
          shapeType: 'circle',
          x: 200,
          y: 200,
          width: 150,
          height: 150,
          fillColor: colorPreset || '#0F172A',
          borderColor: '#38BDF8',
          borderWidth: 3,
          borderRadius: 999,
          zIndex: maxZ + 1
        };
        break;
      }

      // 5. DIAMOND DECISION NODE
      case 'diamond': {
        el = {
          id: `diamond-${Date.now()}`,
          type: 'shape',
          shapeType: 'diamond',
          x: 200,
          y: 200,
          width: 120,
          height: 120,
          fillColor: '#F8FAFC',
          borderColor: '#2563EB',
          borderWidth: 2,
          zIndex: maxZ + 1
        };
        break;
      }

      // 6. SPEECH CALLOUT BUBBLE
      case 'callout': {
        el = {
          id: `callout-${Date.now()}`,
          type: 'shape',
          shapeType: 'callout',
          x: 200,
          y: 200,
          width: 220,
          height: 110,
          fillColor: '#FFFFFF',
          borderColor: '#CBD5E1',
          borderWidth: 2,
          borderRadius: 14,
          shadow: true,
          zIndex: maxZ + 1
        };
        break;
      }

      // 7. ARROWS (Right, Down)
      case 'arrow': {
        el = {
          id: `arrow-${Date.now()}`,
          type: 'shape',
          shapeType: 'arrow',
          x: 200,
          y: 250,
          width: 120,
          height: 30,
          fillColor: colorPreset || '#2563EB',
          borderColor: colorPreset || '#2563EB',
          zIndex: maxZ + 1
        };
        break;
      }

      case 'curved-arrow': {
        el = {
          id: `curved-${Date.now()}`,
          type: 'shape',
          shapeType: 'curved-arrow',
          x: 250,
          y: 250,
          width: 140,
          height: 80,
          fillColor: '#0F172A',
          borderColor: '#0F172A',
          borderWidth: 2,
          zIndex: maxZ + 1
        };
        break;
      }

      // 8. PILL BADGE
      case 'pill': {
        el = {
          id: `pill-${Date.now()}`,
          type: 'shape',
          shapeType: 'pill',
          x: 150,
          y: 100,
          width: 160,
          height: 38,
          fillColor: colorPreset || '#DC2626',
          borderColor: '#B91C1C',
          borderWidth: 1.5,
          borderRadius: 999,
          zIndex: maxZ + 1
        };
        break;
      }

      // 9. STANDARD CARD / CONTAINER
      default: {
        el = {
          id: `card-${Date.now()}`,
          type: 'shape',
          shapeType: 'card',
          x: 150,
          y: 180,
          width: 280,
          height: 240,
          fillColor: '#FFFFFF',
          borderColor: '#E2E8F0',
          borderWidth: 1.5,
          borderRadius: 16,
          shadow: true,
          zIndex: maxZ + 1
        };
        break;
      }
    }

    addElement(el);
  };

  // Add Emoji Sticker
  const handleAddEmoji = (emoji: string) => {
    const maxZ = elements.reduce((max, el) => Math.max(max, el.zIndex), 0);
    const el: CanvasElement = {
      id: `emoji-${Date.now()}`,
      type: 'icon',
      x: 300,
      y: 250,
      width: 60,
      height: 60,
      iconText: emoji,
      fontSize: 44,
      zIndex: maxZ + 1
    };
    addElement(el);
  };

  // Upload Image from User's computer
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const dataUrl = event.target?.result as string;
      if (!dataUrl) return;

      const maxZ = elements.reduce((max, el) => Math.max(max, el.zIndex), 0);
      const el: CanvasElement = {
        id: `image-${Date.now()}`,
        type: 'image',
        x: 150,
        y: 150,
        width: 380,
        height: 260,
        imageUrl: dataUrl,
        imageAlt: file.name,
        borderRadius: 16,
        zIndex: maxZ + 1
      };
      addElement(el);
    };
    reader.readAsDataURL(file);
    e.target.value = '';
  };

  // Mouse interaction: Drag & Move elements
  const handleMouseDownElement = (e: React.MouseEvent, el: CanvasElement) => {
    e.stopPropagation();
    setSelectedId(el.id);
    setActiveTool('properties');
    setIsDragging(true);

    const container = canvasContainerRef.current;
    if (!container) return;
    const rect = container.getBoundingClientRect();
    const scale = canvasWidth / rect.width;

    const mouseX = (e.clientX - rect.left) * scale;
    const mouseY = (e.clientY - rect.top) * scale;

    setDragOffset({
      x: mouseX - el.x,
      y: mouseY - el.y
    });
  };

  // Mouse move handler on canvas container
  const handleMouseMove = (e: React.MouseEvent) => {
    const container = canvasContainerRef.current;
    if (!container) return;
    const rect = container.getBoundingClientRect();
    const scale = canvasWidth / rect.width;

    const mouseX = (e.clientX - rect.left) * scale;
    const mouseY = (e.clientY - rect.top) * scale;

    if (isDragging && selectedId) {
      const newX = Math.round(mouseX - dragOffset.x);
      const newY = Math.round(mouseY - dragOffset.y);
      setElements(prev => prev.map(el => el.id === selectedId ? { ...el, x: newX, y: newY } : el));
    } else if (isResizing && selectedId) {
      const deltaW = Math.round(mouseX - initialResize.x);
      const deltaH = Math.round(mouseY - initialResize.y);
      const newW = Math.max(30, initialResize.w + deltaW);
      const newH = Math.max(16, initialResize.h + deltaH);
      setElements(prev => prev.map(el => el.id === selectedId ? { ...el, width: newW, height: newH } : el));
    }
  };

  const handleMouseUp = () => {
    if (isDragging || isResizing) {
      setIsDragging(false);
      setIsResizing(false);
      setResizeHandle(null);
      pushHistory(elements);
    }
  };

  // Mouse down on resize handle
  const handleResizeStart = (e: React.MouseEvent, handle: string) => {
    e.stopPropagation();
    if (!selectedElement) return;
    setIsResizing(true);
    setResizeHandle(handle);

    const container = canvasContainerRef.current;
    if (!container) return;
    const rect = container.getBoundingClientRect();
    const scale = canvasWidth / rect.width;

    setInitialResize({
      x: (e.clientX - rect.left) * scale,
      y: (e.clientY - rect.top) * scale,
      w: selectedElement.width,
      h: selectedElement.height
    });
  };

  // Slide Navigation and Carousel Operations
  const handleSwitchSlide = (targetIdx: number) => {
    if (targetIdx < 0 || targetIdx >= slides.length) return;
    const updatedSlides = slides.map((s, idx) => idx === currentSlideIdx ? { ...s, elements } : s);
    setSlides(updatedSlides);
    setCurrentSlideIdx(targetIdx);
    setElements(updatedSlides[targetIdx].elements);
    setSelectedId(null);
  };

  const handleAddSlide = () => {
    const newSlideId = `slide-${Date.now()}`;
    const newSlide: CanvasSlide = {
      id: newSlideId,
      title: `Slide ${slides.length + 1}`,
      elements: [
        {
          id: `slide-title-${Date.now()}`,
          type: 'text',
          x: 60,
          y: 70,
          width: 850,
          height: 50,
          text: `Slide ${slides.length + 1}: Key Implementation Insight`,
          fontSize: 32,
          fontFamily: 'sans',
          fontWeight: 'extrabold',
          textColor: '#1F322C',
          zIndex: 1
        }
      ]
    };
    const updatedSlides = slides.map((s, idx) => idx === currentSlideIdx ? { ...s, elements } : s);
    const nextSlides = [...updatedSlides, newSlide];
    setSlides(nextSlides);
    setCurrentSlideIdx(nextSlides.length - 1);
    setElements(newSlide.elements);
    setSelectedId(null);
  };

  const handleDuplicateSlide = () => {
    const dupSlide: CanvasSlide = {
      id: `slide-${Date.now()}`,
      title: `Slide ${slides.length + 1} (Copy)`,
      elements: elements.map(el => ({ ...el, id: `${el.id}-copy-${Date.now()}` }))
    };
    const nextSlides = [...slides, dupSlide];
    setSlides(nextSlides);
    setCurrentSlideIdx(nextSlides.length - 1);
    setElements(dupSlide.elements);
    setSelectedId(null);
  };

  const handleDeleteSlide = (delIdx: number) => {
    if (slides.length <= 1) return;
    const nextSlides = slides.filter((_, idx) => idx !== delIdx);
    const nextIdx = Math.max(0, Math.min(delIdx, nextSlides.length - 1));
    setSlides(nextSlides);
    setCurrentSlideIdx(nextIdx);
    setElements(nextSlides[nextIdx].elements);
    setSelectedId(null);
  };

  // Stamp personal Brand Kit footer onto canvas
  const handleStampBrandKit = () => {
    const handle = localStorage.getItem('poststudio_brand_handle') || '@alexvance.ai';
    const name = localStorage.getItem('poststudio_brand_name') || 'Alex Vance';
    const title = localStorage.getItem('poststudio_brand_title') || 'Principal AI Architect';
    const maxZ = elements.reduce((max, el) => Math.max(max, el.zIndex), 0);
    const brandEl: CanvasElement = {
      id: `brand-stamp-${Date.now()}`,
      type: 'text',
      x: 60,
      y: Math.max(100, canvasHeight - 60),
      width: 700,
      height: 30,
      text: `${name} · ${handle} | ${title}`,
      fontSize: 13,
      fontFamily: 'mono',
      fontWeight: 'bold',
      textColor: '#3E6F58',
      zIndex: maxZ + 1
    };
    addElement(brandEl);
  };

  // High-Res Render Engine (renders any slide or current elements)
  const renderSlideToCanvas = async (slideElements: CanvasElement[], backgroundClr: string): Promise<HTMLCanvasElement | null> => {
    const canvas = document.createElement('canvas');
    canvas.width = canvasWidth;
    canvas.height = canvasHeight;
    const ctx = canvas.getContext('2d');
    if (!ctx) return null;

    // 1. Background
    ctx.fillStyle = backgroundClr || bgColor;
    ctx.fillRect(0, 0, canvasWidth, canvasHeight);

    // 2. Background image
    if (bgImageUrl) {
      await new Promise<void>((resolve) => {
        const img = new Image();
        img.crossOrigin = 'anonymous';
        img.onload = () => {
          ctx.drawImage(img, 0, 0, canvasWidth, canvasHeight);
          resolve();
        };
        img.onerror = () => resolve();
        img.src = bgImageUrl;
      });
    }

    const sorted = [...slideElements].sort((a, b) => a.zIndex - b.zIndex);

    for (const el of sorted) {
      if (el.type === 'code') {
        ctx.save();
        ctx.fillStyle = el.fillColor || '#0F172A';
        ctx.beginPath();
        ctx.roundRect(el.x, el.y, el.width, el.height, el.borderRadius || 12);
        ctx.fill();

        // Terminal dots
        ctx.fillStyle = '#EF4444';
        ctx.beginPath();
        ctx.arc(el.x + 18, el.y + 16, 4, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = '#F59E0B';
        ctx.beginPath();
        ctx.arc(el.x + 30, el.y + 16, 4, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = '#10B981';
        ctx.beginPath();
        ctx.arc(el.x + 42, el.y + 16, 4, 0, Math.PI * 2);
        ctx.fill();

        // Language tag
        ctx.font = "bold 10px monospace";
        ctx.fillStyle = "#94A3B8";
        ctx.fillText((el.codeLanguage || 'PYTHON').toUpperCase(), el.x + el.width - 65, el.y + 19);

        let curY = el.y + 38;
        if (el.accentText) {
          ctx.font = "bold 11px sans-serif";
          ctx.fillStyle = "#38BDF8";
          ctx.fillText(el.accentText, el.x + 16, curY);
          curY += 18;
        }

        ctx.font = "12px monospace";
        ctx.fillStyle = el.textColor || "#E2E8F0";
        const codeLines = (el.codeText || el.text || '').split('\n');
        codeLines.forEach((line) => {
          ctx.fillText(line, el.x + 16, curY);
          curY += 16;
        });
        ctx.restore();
      } else if (el.type === 'shape') {
        ctx.save();
        ctx.fillStyle = el.fillColor || 'transparent';
        ctx.strokeStyle = el.borderColor || 'transparent';
        ctx.lineWidth = el.borderWidth || 0;
        ctx.globalAlpha = el.opacity ?? 1;
        const rad = el.borderRadius || 0;

        ctx.beginPath();
        if (el.shapeType === 'circle') {
          ctx.arc(el.x + el.width / 2, el.y + el.height / 2, el.width / 2, 0, Math.PI * 2);
        } else if (el.shapeType === 'diamond') {
          const cx = el.x + el.width / 2;
          const cy = el.y + el.height / 2;
          ctx.moveTo(cx, el.y);
          ctx.lineTo(el.x + el.width, cy);
          ctx.lineTo(cx, el.y + el.height);
          ctx.lineTo(el.x, cy);
          ctx.closePath();
        } else if (el.shapeType === 'arrow') {
          const h = el.height;
          const w = el.width;
          ctx.moveTo(el.x, el.y + h / 3);
          ctx.lineTo(el.x + w - h, el.y + h / 3);
          ctx.lineTo(el.x + w - h, el.y);
          ctx.lineTo(el.x + w, el.y + h / 2);
          ctx.lineTo(el.x + w - h, el.y + h);
          ctx.lineTo(el.x + w - h, el.y + 2 * h / 3);
          ctx.lineTo(el.x, el.y + 2 * h / 3);
          ctx.closePath();
        } else {
          ctx.roundRect(el.x, el.y, el.width, el.height, rad);
        }

        if (el.fillColor) ctx.fill();
        if (el.borderWidth && el.borderColor) ctx.stroke();
        ctx.restore();
      } else if (el.type === 'text') {
        if (el.bgColor) {
          ctx.fillStyle = el.bgColor;
          ctx.beginPath();
          ctx.roundRect(el.x, el.y, el.width, el.height, 6);
          ctx.fill();
        }

        const fontFace = el.fontFamily === 'serif' 
          ? 'Georgia, serif' 
          : el.fontFamily === 'mono' 
            ? 'monospace' 
            : el.fontFamily === 'display' 
              ? 'Impact, sans-serif' 
              : "'Plus Jakarta Sans', sans-serif";
        const weight = el.fontWeight === 'extrabold' ? '800' : el.fontWeight === 'bold' ? 'bold' : 'normal';
        ctx.font = `${weight} ${el.fontSize || 16}px ${fontFace}`;
        ctx.fillStyle = el.textColor || '#0F172A';

        const lines = (el.text || '').split('\n');
        const lineHeight = (el.fontSize || 16) * 1.35;
        lines.forEach((line, li) => {
          ctx.fillText(line, el.x + 8, el.y + (el.fontSize || 16) + li * lineHeight);
        });
      } else if (el.type === 'image' && el.imageUrl) {
        await new Promise<void>((resolve) => {
          const img = new Image();
          img.crossOrigin = 'anonymous';
          img.onload = () => {
            ctx.save();
            if (el.borderRadius) {
              ctx.beginPath();
              ctx.roundRect(el.x, el.y, el.width, el.height, el.borderRadius);
              ctx.clip();
            }
            ctx.drawImage(img, el.x, el.y, el.width, el.height);
            ctx.restore();
            resolve();
          };
          img.onerror = () => resolve();
          img.src = el.imageUrl!;
        });
      } else if (el.type === 'icon' && el.iconText) {
        ctx.font = `${el.fontSize || 36}px sans-serif`;
        ctx.fillText(el.iconText, el.x, el.y + (el.fontSize || 36));
      }
    }

    return canvas;
  };

  const renderToOffscreenCanvas = async (): Promise<HTMLCanvasElement | null> => {
    return renderSlideToCanvas(elements, bgColor);
  };

  // Export: Download HD PNG
  const handleDownload = async () => {
    setIsExporting(true);
    try {
      const canvas = await renderToOffscreenCanvas();
      if (!canvas) return;
      const dataUrl = canvas.toDataURL('image/png');
      const link = document.createElement('a');
      link.download = `canva-postmark-${Date.now()}.png`;
      link.href = dataUrl;
      link.click();
      setDownloadSuccess(true);
      setTimeout(() => setDownloadSuccess(false), 2000);
    } finally {
      setIsExporting(false);
    }
  };

  // Export: Download Multi-Page LinkedIn PDF Carousel
  const handleDownloadCarouselPdf = async () => {
    setIsExporting(true);
    try {
      const currentSlides = slides.map((s, idx) => idx === currentSlideIdx ? { ...s, elements } : s);
      const isLandscape = aspectRatio === '16:9';
      const pdf = new jsPDF({
        orientation: isLandscape ? 'landscape' : 'portrait',
        unit: 'px',
        format: [canvasWidth, canvasHeight]
      });

      for (let i = 0; i < currentSlides.length; i++) {
        if (i > 0) {
          pdf.addPage([canvasWidth, canvasHeight], isLandscape ? 'landscape' : 'portrait');
        }
        const c = await renderSlideToCanvas(currentSlides[i].elements, bgColor);
        if (c) {
          const imgData = c.toDataURL('image/jpeg', 0.95);
          pdf.addImage(imgData, 'JPEG', 0, 0, canvasWidth, canvasHeight);
        }
      }

      pdf.save(`linkedin-carousel-${Date.now()}.pdf`);
      setPdfSuccess(true);
      setTimeout(() => setPdfSuccess(false), 2500);
    } catch (err) {
      console.error('Failed to export carousel PDF:', err);
    } finally {
      setIsExporting(false);
    }
  };

  // Export: Copy to Clipboard
  const handleCopyClipboard = async () => {
    setIsExporting(true);
    try {
      const canvas = await renderToOffscreenCanvas();
      if (!canvas) return;
      canvas.toBlob(async (blob) => {
        if (!blob) return;
        await navigator.clipboard.write([
          new ClipboardItem({ 'image/png': blob })
        ]);
        setCopySuccess(true);
        setTimeout(() => setCopySuccess(false), 2000);
      });
    } catch (e) {
      console.warn('Clipboard write error:', e);
    } finally {

      setIsExporting(false);
    }
  };

  // Export: Apply to Studio Card 02
  const handleApplyToStudio = async () => {
    setIsExporting(true);
    try {
      const canvas = await renderToOffscreenCanvas();
      if (!canvas) return;
      const dataUrl = canvas.toDataURL('image/png');
      const headlineText = elements.find(el => el.type === 'text' && (el.fontSize || 0) > 25)?.text || initialThought;
      if (onApplyToStudio) {
        onApplyToStudio(dataUrl, headlineText);
      }
      if (onClose) {
        onClose();
      }
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="w-full flex flex-col gap-4 p-5 rounded-2xl bg-white border border-studio-border shadow-sm selection:bg-studio-accent selection:text-white">
      
      {/* 1. TOP HEADER & EXPORT TOOLBAR */}
      <div className="flex items-center justify-between pb-3 border-b border-studio-border flex-wrap gap-3">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-studio-accent text-white flex items-center justify-center font-bold shadow-xs">
            <Palette className="w-5 h-5 text-emerald-200" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-extrabold text-studio-text tracking-tight">
                Canva-Grade Freeform Visual Studio
              </h2>
              <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200">
                DRAG & DROP
              </span>
            </div>
            <p className="text-[11px] text-studio-muted">
              Move, resize, recolor, add sticky notes, highlighters, arrows, and build viral infographics.
            </p>
          </div>
        </div>

        {/* Action buttons */}
        <div className="flex items-center gap-2 flex-wrap">
          {onClose && (
            <button
              onClick={onClose}
              className="px-3 py-1.5 rounded-lg border border-studio-border text-xs font-bold text-studio-muted hover:text-studio-text hover:bg-studio-bg transition-colors cursor-pointer"
            >
              Back to Studio
            </button>
          )}

          <button
            onClick={handleUndo}
            disabled={historyIndex <= 0}
            className="p-1.5 rounded-lg border border-studio-border text-xs text-studio-muted hover:text-studio-text disabled:opacity-30 cursor-pointer"
            title="Undo"
          >
            <RotateCcw className="w-4 h-4" />
          </button>

          <button
            onClick={handleCopyClipboard}
            disabled={isExporting}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-studio-border bg-white text-xs font-bold text-studio-text hover:bg-studio-bg shadow-2xs transition-all cursor-pointer"
          >
            {copySuccess ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5 text-studio-accent" />}
            <span>{copySuccess ? 'Copied!' : 'Copy Image'}</span>
          </button>

          <button
            onClick={handleDownload}
            disabled={isExporting}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-studio-border bg-white text-xs font-bold text-studio-text hover:bg-studio-bg shadow-2xs transition-all cursor-pointer"
          >
            {downloadSuccess ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Download className="w-3.5 h-3.5 text-studio-accent" />}
            <span>{downloadSuccess ? 'Downloaded!' : 'Download PNG'}</span>
          </button>

          {/* Export LinkedIn PDF Carousel */}
          <button
            onClick={handleDownloadCarouselPdf}
            disabled={isExporting}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-emerald-700 text-white text-xs font-bold hover:bg-emerald-800 shadow-2xs transition-all cursor-pointer"
            title="Download multi-page PDF document for LinkedIn carousels"
          >
            {pdfSuccess ? <Check className="w-3.5 h-3.5 text-emerald-200" /> : <FileText className="w-3.5 h-3.5 text-emerald-200" />}
            <span>{pdfSuccess ? 'PDF Exported!' : `Export Carousel PDF (${slides.length}p)`}</span>
          </button>

          {onApplyToStudio && (
            <button
              onClick={handleApplyToStudio}
              disabled={isExporting}
              className="flex items-center gap-1.5 px-4 py-1.5 rounded-lg bg-studio-accent text-white text-xs font-bold hover:bg-studio-accentHover shadow-2xs transition-all cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5 text-emerald-200" />
              <span>Apply to Current Post</span>
            </button>
          )}
        </div>
      </div>

      {/* 2. SUB-BAR: Presets & Aspect Ratios */}
      <div className="flex items-center justify-between bg-studio-bg/70 p-2.5 rounded-xl border border-studio-border flex-wrap gap-3">
        {/* Aspect Ratios */}
        <div className="flex items-center gap-2">
          <span className="text-[11px] font-bold text-studio-subtle uppercase">Canvas:</span>
          {[
            { id: '16:9', label: '16:9 Landscape' },
            { id: '1:1', label: '1:1 Square' },
            { id: '4:5', label: '4:5 Portrait' }
          ].map(r => (
            <button
              key={r.id}
              onClick={() => setAspectRatio(r.id as AspectRatio)}
              className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                aspectRatio === r.id
                  ? 'bg-studio-text text-white shadow-2xs'
                  : 'bg-white border border-studio-border text-studio-muted hover:text-studio-text'
              }`}
            >
              {r.label}
            </button>
          ))}
        </div>

        {/* Canvas Actions */}
        <div className="flex items-center gap-2">
          <button
            onClick={handleStampBrandKit}
            className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-bold hover:bg-emerald-100 transition-colors cursor-pointer"
            title="Stamp your Creator Name & Handle at the bottom"
          >
            <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
            <span>Stamp Brand Kit</span>
          </button>

          <button
            onClick={handleClearCanvas}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-stone-100 text-stone-700 border border-stone-300 text-xs font-bold hover:bg-stone-200 transition-all cursor-pointer shadow-2xs"
            title="Start with a blank canvas"
          >
            <Trash2 className="w-3.5 h-3.5 text-red-500" />
            <span>Clear / Blank Canvas</span>
          </button>
        </div>
      </div>

      {/* 2.5 CAROUSEL SLIDE DOCK (MULTI-SLIDE CAROUSEL STUDIO) */}
      <div className="flex items-center justify-between bg-white p-2.5 rounded-xl border border-studio-border flex-wrap gap-2 shadow-2xs">
        <div className="flex items-center gap-1.5 overflow-x-auto py-0.5">
          <div className="flex items-center gap-1 text-[11px] font-bold text-stone-500 uppercase tracking-wider mr-1">
            <Layers className="w-3.5 h-3.5 text-studio-accent" />
            <span>Slides:</span>
          </div>

          {slides.map((s, idx) => (
            <button
              key={s.id}
              onClick={() => handleSwitchSlide(idx)}
              className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                currentSlideIdx === idx
                  ? 'bg-studio-accent text-white shadow-2xs'
                  : 'bg-stone-50 border border-stone-200 text-stone-700 hover:bg-stone-100'
              }`}
            >
              <span>Slide {idx + 1}</span>
              {slides.length > 1 && (
                <span 
                  onClick={(e) => { e.stopPropagation(); handleDeleteSlide(idx); }}
                  className="text-[10px] ml-1 opacity-60 hover:opacity-100 hover:text-red-300"
                  title="Delete slide"
                >
                  ✕
                </span>
              )}
            </button>
          ))}

          <button
            onClick={handleAddSlide}
            className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-stone-50 border border-dashed border-stone-300 text-xs font-bold text-stone-600 hover:border-studio-accent hover:text-studio-accent transition-colors cursor-pointer"
            title="Add new slide to carousel"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Slide</span>
          </button>

          <button
            onClick={handleDuplicateSlide}
            className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-stone-50 border border-stone-200 text-xs font-semibold text-stone-600 hover:bg-stone-100 transition-colors cursor-pointer"
            title="Duplicate current slide"
          >
            <Copy className="w-3 h-3" />
            <span>Clone</span>
          </button>
        </div>

        <span className="text-[11px] text-studio-muted font-medium">
          Slide {currentSlideIdx + 1} of {slides.length} · Export as PDF Carousel above
        </span>
      </div>

      {/* 3. MAIN WORKBENCH: Left Shapes & Tools + Center Freeform Canvas + Right Properties */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
        
        {/* LEFT TOOL PALETTE (3 cols) */}
        <div className="lg:col-span-3 flex flex-col gap-4">
          
          <div className="grid grid-cols-4 gap-1 p-1 bg-stone-100 rounded-xl border border-stone-200">
            {[
              { id: 'shapes', label: '🔷 Shapes' },
              { id: 'add', label: '➕ Text' },
              { id: 'images', label: '🖼️ Media' },
              { id: 'properties', label: selectedElement ? '⚙️ Edit' : '⚙️ Canvas' }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTool(tab.id as any)}
                className={`py-1.5 px-0.5 rounded-lg text-[11px] font-bold text-center transition-all cursor-pointer truncate ${
                  activeTool === tab.id
                    ? 'bg-white text-studio-text shadow-2xs font-extrabold'
                    : 'text-stone-500 hover:text-stone-800'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* TAB 1: SHAPES LIBRARY (EXPANDED TO ALL SHAPES) */}
          {activeTool === 'shapes' && (

            <div className="p-3.5 rounded-xl bg-studio-bg/60 border border-studio-border flex flex-col gap-3 max-h-[70vh] overflow-y-auto">
              
              {/* Sticky Notes */}
              <div className="flex flex-col gap-1.5">
                <span className="text-xs font-extrabold text-studio-text flex items-center gap-1.5">
                  <StickyNote className="w-3.5 h-3.5 text-amber-600" />
                  <span>Sticky Notes (Orvynix Style)</span>
                </span>
                <div className="grid grid-cols-2 gap-1.5">
                  {[
                    { label: 'Yellow Sticky', bg: '#FEFCE8' },
                    { label: 'Blue Sticky', bg: '#EFF6FF' },
                    { label: 'Green Sticky', bg: '#F0FDF4' },
                    { label: 'Pink Sticky', bg: '#FFF1F2' }
                  ].map(s => (
                    <button
                      key={s.label}
                      onClick={() => handleAddShape('sticky', s.bg)}
                      className="p-2 rounded-lg border text-xs font-bold text-stone-800 text-left shadow-2xs hover:scale-102 transition-all cursor-pointer"
                      style={{ backgroundColor: s.bg, borderColor: '#CBD5E1' }}
                    >
                      {s.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Highlighter Bars */}
              <div className="flex flex-col gap-1.5 pt-2 border-t border-studio-border/60">
                <span className="text-xs font-extrabold text-studio-text flex items-center gap-1.5">
                  <Highlighter className="w-3.5 h-3.5 text-yellow-600" />
                  <span>Highlighter Accents (Hook Bars)</span>
                </span>
                <div className="grid grid-cols-2 gap-1.5">
                  {[
                    { label: 'Neon Yellow', color: '#FEF08A' },
                    { label: 'Mint Green', color: '#A7F3D0' },
                    { label: 'Sky Cyan', color: '#BAE6FD' },
                    { label: 'Candy Pink', color: '#FBCFE8' }
                  ].map(h => (
                    <button
                      key={h.label}
                      onClick={() => handleAddShape('highlighter', h.color)}
                      className="py-1.5 px-2 rounded-md text-[11px] font-extrabold text-stone-900 text-center shadow-2xs hover:scale-102 transition-all cursor-pointer"
                      style={{ backgroundColor: h.color }}
                    >
                      {h.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Functional Layout Shapes */}
              <div className="flex flex-col gap-1.5 pt-2 border-t border-studio-border/60">
                <span className="text-xs font-extrabold text-studio-text">Containers & Nodes</span>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => handleAddShape('card')}
                    className="flex flex-col items-center gap-1 p-2.5 rounded-lg bg-white border border-studio-border hover:border-studio-accent transition-all text-center cursor-pointer shadow-2xs"
                  >
                    <Square className="w-4 h-4 text-studio-accent" />
                    <span className="text-[11px] font-bold text-studio-text">Card Container</span>
                  </button>
                  <button
                    onClick={() => handleAddShape('circle')}
                    className="flex flex-col items-center gap-1 p-2.5 rounded-lg bg-white border border-studio-border hover:border-studio-accent transition-all text-center cursor-pointer shadow-2xs"
                  >
                    <Circle className="w-4 h-4 text-studio-accent" />
                    <span className="text-[11px] font-bold text-studio-text">Hub Circle</span>
                  </button>
                  <button
                    onClick={() => handleAddShape('diamond')}
                    className="flex flex-col items-center gap-1 p-2.5 rounded-lg bg-white border border-studio-border hover:border-studio-accent transition-all text-center cursor-pointer shadow-2xs"
                  >
                    <div className="w-4 h-4 border-2 border-studio-accent rotate-45" />
                    <span className="text-[11px] font-bold text-studio-text">Diamond Node</span>
                  </button>
                  <button
                    onClick={() => handleAddShape('callout')}
                    className="flex flex-col items-center gap-1 p-2.5 rounded-lg bg-white border border-studio-border hover:border-studio-accent transition-all text-center cursor-pointer shadow-2xs"
                  >
                    <MessageSquare className="w-4 h-4 text-studio-accent" />
                    <span className="text-[11px] font-bold text-studio-text">Speech Callout</span>
                  </button>
                  <button
                    onClick={() => handleAddShape('pill')}
                    className="flex flex-col items-center gap-1 p-2.5 rounded-lg bg-white border border-studio-border hover:border-studio-accent transition-all text-center cursor-pointer shadow-2xs"
                  >
                    <Tag className="w-4 h-4 text-studio-accent" />
                    <span className="text-[11px] font-bold text-studio-text">Pill Badge</span>
                  </button>
                  <button
                    onClick={() => handleAddShape('takeaway-bar')}
                    className="flex flex-col items-center gap-1 p-2.5 rounded-lg bg-white border border-studio-border hover:border-studio-accent transition-all text-center cursor-pointer shadow-2xs"
                  >
                    <Lightbulb className="w-4 h-4 text-red-500" />
                    <span className="text-[11px] font-bold text-studio-text">Takeaway Bar</span>
                  </button>
                </div>
              </div>

              {/* Arrows & Connectors */}
              <div className="flex flex-col gap-1.5 pt-2 border-t border-studio-border/60">
                <span className="text-xs font-extrabold text-studio-text">Arrows & Connectors</span>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => handleAddShape('arrow')}
                    className="flex items-center justify-center gap-1.5 p-2 rounded-lg bg-white border border-studio-border hover:border-studio-accent text-xs font-bold text-studio-text cursor-pointer"
                  >
                    <ArrowRight className="w-4 h-4 text-studio-accent" />
                    <span>Right Arrow</span>
                  </button>
                  <button
                    onClick={() => handleAddShape('curved-arrow')}
                    className="flex items-center justify-center gap-1.5 p-2 rounded-lg bg-white border border-studio-border hover:border-studio-accent text-xs font-bold text-studio-text cursor-pointer"
                  >
                    <Spline className="w-4 h-4 text-studio-accent" />
                    <span>Curved Flow</span>
                  </button>
                </div>
              </div>

              {/* Emoji Icons */}
              <div className="flex flex-col gap-1.5 pt-2 border-t border-studio-border/60">
                <span className="text-[11px] font-bold text-studio-subtle">Badge Icons</span>
                <div className="grid grid-cols-5 gap-1.5">
                  {['🎯', '⚙️', '🛡️', '📊', '💡', '⚠️', '✅', '❌', '🤖', '🔧', '📦', '💬', '🔥', '⚡', '🚀'].map(em => (
                    <button
                      key={em}
                      onClick={() => handleAddEmoji(em)}
                      className="w-8 h-8 rounded-lg bg-white border border-studio-border hover:bg-studio-activePill flex items-center justify-center text-sm transition-all cursor-pointer"
                    >
                      {em}
                    </button>
                  ))}
                </div>
              </div>

            </div>
          )}

          {/* TAB 2: TEXT */}
          {activeTool === 'add' && (
            <div className="p-3.5 rounded-xl bg-studio-bg/60 border border-studio-border flex flex-col gap-2.5">
              <span className="text-xs font-extrabold text-studio-text">Add Typography</span>
              <button
                onClick={() => handleAddText('headline')}
                className="w-full text-left p-2.5 rounded-lg bg-white border border-studio-border hover:border-studio-accent transition-all shadow-2xs cursor-pointer"
              >
                <div className="text-sm font-extrabold text-studio-text">Large Heading</div>
                <div className="text-[10px] text-studio-muted">Hook or Blueprint Title</div>
              </button>
              <button
                onClick={() => handleAddText('subtitle')}
                className="w-full text-left p-2.5 rounded-lg bg-white border border-studio-border hover:border-studio-accent transition-all shadow-2xs cursor-pointer"
              >
                <div className="text-xs font-bold text-studio-text">Sub-Hook / Subtitle</div>
                <div className="text-[10px] text-studio-muted">Context explanation</div>
              </button>
              <button
                onClick={() => handleAddText('body')}
                className="w-full text-left p-2.5 rounded-lg bg-white border border-studio-border hover:border-studio-accent transition-all shadow-2xs cursor-pointer"
              >
                <div className="text-xs font-medium text-studio-text">Bullet Points List</div>
                <div className="text-[10px] text-studio-muted">Sub-features or steps</div>
              </button>
              <button
                onClick={() => handleAddText('badge')}
                className="w-full text-left p-2.5 rounded-lg bg-white border border-studio-border hover:border-studio-accent transition-all shadow-2xs cursor-pointer"
              >
                <div className="text-xs font-bold text-red-600">Category / Stage Pill</div>
                <div className="text-[10px] text-studio-muted">Stage 01, 02 number badge</div>
              </button>

              <div className="pt-2 border-t border-studio-border/60 flex flex-col gap-2">
                <span className="text-[11px] font-bold text-studio-subtle">Developer & Brand Additions</span>
                
                <button
                  onClick={() => handleAddCodeBlock('python')}
                  className="w-full text-left p-2 rounded-lg bg-slate-900 border border-slate-700 hover:border-sky-400 transition-all shadow-2xs cursor-pointer group"
                >
                  <div className="flex items-center gap-1.5 text-xs font-bold text-sky-400">
                    <Code className="w-3.5 h-3.5" />
                    <span>Python Code Block</span>
                  </div>
                  <div className="text-[10px] text-slate-400">Terminal with syntax & traffic dots</div>
                </button>

                <button
                  onClick={() => handleAddCodeBlock('typescript')}
                  className="w-full text-left p-2 rounded-lg bg-slate-900 border border-slate-700 hover:border-sky-400 transition-all shadow-2xs cursor-pointer group"
                >
                  <div className="flex items-center gap-1.5 text-xs font-bold text-sky-400">
                    <Code className="w-3.5 h-3.5" />
                    <span>TypeScript Code Block</span>
                  </div>
                  <div className="text-[10px] text-slate-400">Interface or type schema card</div>
                </button>

                <button
                  onClick={handleStampBrandKit}
                  className="w-full text-left p-2 rounded-lg bg-emerald-50 border border-emerald-200 hover:bg-emerald-100 transition-all shadow-2xs cursor-pointer"
                >
                  <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-800">
                    <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Stamp Brand Kit Footer</span>
                  </div>
                  <div className="text-[10px] text-emerald-600">Name · Handle | Job Title</div>
                </button>
              </div>
            </div>
          )}


          {/* TAB 3: MEDIA & UPLOAD */}
          {activeTool === 'images' && (
            <div className="p-3.5 rounded-xl bg-studio-bg/60 border border-studio-border flex flex-col gap-3">
              <span className="text-xs font-extrabold text-studio-text">Upload Custom Media</span>
              
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileUpload}
                className="hidden"
              />
              <button
                onClick={() => fileInputRef.current?.click()}
                className="flex items-center justify-center gap-2 p-3 rounded-xl bg-studio-accent text-white text-xs font-bold hover:bg-studio-accentHover transition-all shadow-2xs cursor-pointer"
              >
                <Upload className="w-4 h-4 text-emerald-200" />
                <span>Upload Image from Device</span>
              </button>

              <div className="flex flex-col gap-2 pt-2 border-t border-studio-border/60">
                <span className="text-[11px] font-bold text-studio-subtle">Canvas Background</span>
                <div className="grid grid-cols-4 gap-1.5">
                  {[
                    { label: 'Slate White', color: '#F8FAFC' },
                    { label: 'Warm Cream', color: '#FFFDF5' },
                    { label: 'Deep Forest', color: '#14221A' },
                    { label: 'Obsidian', color: '#0F172A' }
                  ].map(c => (
                    <button
                      key={c.color}
                      onClick={() => setBgColor(c.color)}
                      className={`h-8 rounded-lg border border-black/20 transition-all cursor-pointer ${
                        bgColor === c.color ? 'ring-2 ring-studio-accent' : ''
                      }`}
                      style={{ backgroundColor: c.color }}
                      title={c.label}
                    />
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: PROPERTIES / EDIT (Available in left panel too!) */}
          {activeTool === 'properties' && (
            <div className="p-3.5 rounded-xl bg-studio-bg/60 border border-studio-border flex flex-col gap-3 max-h-[70vh] overflow-y-auto">
              {selectedElement ? (
                <>
                  <div className="flex items-center justify-between pb-2 border-b border-studio-border">
                    <span className="text-xs font-extrabold text-studio-text uppercase tracking-wider">
                      Editing: {selectedElement.type.toUpperCase()}
                    </span>
                    <div className="flex items-center gap-1">
                      <button
                        onClick={handleDuplicateSelected}
                        className="p-1 rounded text-studio-muted hover:text-studio-text hover:bg-studio-bg cursor-pointer"
                        title="Duplicate (Ctrl+D)"
                      >
                        <Copy className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={handleDeleteSelected}
                        className="p-1 rounded text-red-500 hover:text-red-700 hover:bg-red-50 cursor-pointer"
                        title="Delete (Backspace)"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  {selectedElement.type === 'text' && (
                    <>
                      <div className="flex flex-col gap-1">
                        <label className="text-[11px] font-bold text-studio-subtle">Text Content</label>
                        <textarea
                          rows={3}
                          value={selectedElement.text || ''}
                          onChange={(e) => updateSelected({ text: e.target.value })}
                          className="w-full p-2 rounded-lg border border-studio-border bg-white text-xs text-studio-text font-medium resize-none"
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        <div className="flex flex-col gap-1">
                          <label className="text-[11px] font-bold text-studio-subtle">Size ({selectedElement.fontSize || 16}px)</label>
                          <input
                            type="range"
                            min={10}
                            max={72}
                            value={selectedElement.fontSize || 16}
                            onChange={(e) => updateSelected({ fontSize: Number(e.target.value) })}
                            className="w-full accent-studio-accent cursor-pointer"
                          />
                        </div>
                        <div className="flex flex-col gap-1">
                          <label className="text-[11px] font-bold text-studio-subtle">Color</label>
                          <input
                            type="color"
                            value={selectedElement.textColor || '#0F172A'}
                            onChange={(e) => updateSelected({ textColor: e.target.value })}
                            className="w-full h-7 rounded border border-studio-border cursor-pointer"
                          />
                        </div>
                      </div>
                    </>
                  )}

                  {selectedElement.type === 'shape' && (
                    <>
                      <div className="grid grid-cols-2 gap-2">
                        <div className="flex flex-col gap-1">
                          <label className="text-[11px] font-bold text-studio-subtle">Fill Color</label>
                          <input
                            type="color"
                            value={selectedElement.fillColor || '#FFFFFF'}
                            onChange={(e) => updateSelected({ fillColor: e.target.value })}
                            className="w-full h-8 rounded border border-studio-border cursor-pointer"
                          />
                        </div>
                        <div className="flex flex-col gap-1">
                          <label className="text-[11px] font-bold text-studio-subtle">Border Color</label>
                          <input
                            type="color"
                            value={selectedElement.borderColor || '#E2E8F0'}
                            onChange={(e) => updateSelected({ borderColor: e.target.value })}
                            className="w-full h-8 rounded border border-studio-border cursor-pointer"
                          />
                        </div>
                      </div>
                      <div className="flex flex-col gap-1">
                        <label className="text-[11px] font-bold text-studio-subtle">Corner Radius ({selectedElement.borderRadius || 12}px)</label>
                        <input
                          type="range"
                          min={0}
                          max={40}
                          value={selectedElement.borderRadius || 12}
                          onChange={(e) => updateSelected({ borderRadius: Number(e.target.value) })}
                          className="w-full accent-studio-accent cursor-pointer"
                        />
                      </div>
                    </>
                  )}
                </>
              ) : (
                <div className="text-center py-6 text-stone-400 text-xs">
                  Click on any shape or heading on the canvas to edit it here.
                </div>
              )}
            </div>
          )}

        </div>

        {/* CENTER INTERACTIVE FREEFORM CANVAS (9 cols - Expanded for maximum workspace) */}
        <div className="lg:col-span-9 flex flex-col gap-2">
          
          {/* FLOATING QUICK-EDIT BAR WHEN AN ELEMENT IS SELECTED */}
          {selectedElement ? (
            <div className="flex items-center justify-between p-2 rounded-xl bg-white border-2 border-emerald-500 shadow-md flex-wrap gap-2 animate-in fade-in duration-150">
              <div className="flex items-center gap-2">
                <span className="text-xs font-extrabold text-studio-text flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-800 border border-emerald-200">
                  Editing: {selectedElement.type.toUpperCase()}
                </span>

                {selectedElement.type === 'text' && (
                  <div className="flex items-center gap-1.5 border-l border-stone-200 pl-2">
                    <button
                      onClick={() => updateSelected({ fontSize: Math.max(10, (selectedElement.fontSize || 16) - 2) })}
                      className="w-6 h-6 rounded bg-stone-100 font-bold text-xs hover:bg-stone-200 cursor-pointer"
                      title="Decrease font size"
                    >
                      -
                    </button>
                    <span className="text-xs font-mono font-bold">{selectedElement.fontSize || 16}px</span>
                    <button
                      onClick={() => updateSelected({ fontSize: Math.min(72, (selectedElement.fontSize || 16) + 2) })}
                      className="w-6 h-6 rounded bg-stone-100 font-bold text-xs hover:bg-stone-200 cursor-pointer"
                      title="Increase font size"
                    >
                      +
                    </button>
                    <div className="flex items-center gap-1 ml-1">
                      <span className="text-[10px] text-stone-500 font-medium">Color:</span>
                      <input
                        type="color"
                        value={selectedElement.textColor || '#0F172A'}
                        onChange={(e) => updateSelected({ textColor: e.target.value })}
                        className="w-5 h-5 rounded cursor-pointer border border-stone-300"
                      />
                    </div>
                  </div>
                )}

                {selectedElement.type === 'shape' && (
                  <div className="flex items-center gap-2 border-l border-stone-200 pl-2">
                    <div className="flex items-center gap-1">
                      <span className="text-[10px] text-stone-500 font-medium">Fill:</span>
                      <input
                        type="color"
                        value={selectedElement.fillColor || '#FFFFFF'}
                        onChange={(e) => updateSelected({ fillColor: e.target.value })}
                        className="w-5 h-5 rounded cursor-pointer border border-stone-300"
                      />
                    </div>
                    <div className="flex items-center gap-1">
                      <span className="text-[10px] text-stone-500 font-medium">Border:</span>
                      <input
                        type="color"
                        value={selectedElement.borderColor || '#CBD5E1'}
                        onChange={(e) => updateSelected({ borderColor: e.target.value })}
                        className="w-5 h-5 rounded cursor-pointer border border-stone-300"
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* Common Quick Actions */}
              <div className="flex items-center gap-1.5">
                <button
                  onClick={handleDuplicateSelected}
                  className="flex items-center gap-1 px-2 py-1 rounded bg-stone-100 hover:bg-stone-200 text-xs font-bold text-stone-700 cursor-pointer"
                  title="Duplicate (Ctrl+D)"
                >
                  <Copy className="w-3.5 h-3.5" />
                  <span>Duplicate</span>
                </button>
                <button
                  onClick={handleBringToFront}
                  className="p-1 rounded bg-stone-100 hover:bg-stone-200 text-stone-700 cursor-pointer"
                  title="Bring to Front"
                >
                  <ChevronUp className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={handleSendToBack}
                  className="p-1 rounded bg-stone-100 hover:bg-stone-200 text-stone-700 cursor-pointer"
                  title="Send to Back"
                >
                  <ChevronDown className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={handleDeleteSelected}
                  className="flex items-center gap-1 px-2 py-1 rounded bg-red-50 hover:bg-red-100 text-xs font-bold text-red-600 cursor-pointer"
                  title="Delete (Backspace)"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Delete</span>
                </button>
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-between text-xs text-studio-muted px-1">
              <span className="flex items-center gap-1.5 font-bold text-studio-text">
                <MousePointer className="w-3.5 h-3.5 text-studio-accent" />
                <span>Freeform Canvas ({canvasWidth} × {canvasHeight}px)</span>
              </span>
              <span className="italic text-[11px]">Click any shape or text on canvas to select & edit</span>
            </div>
          )}

          {/* THE FREEFORM CANVAS CONTAINER */}
          <div 
            ref={canvasContainerRef}
            onClick={(e) => {
              if (e.target === canvasContainerRef.current) {
                setSelectedId(null);
              }
            }}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            className="w-full relative rounded-2xl overflow-hidden border-2 border-studio-border shadow-lg cursor-crosshair select-none"
            style={{
              aspectRatio: aspectRatio === '16:9' ? '16/9' : aspectRatio === '1:1' ? '1/1' : '4/5',
              backgroundColor: bgColor
            }}
          >
            {/* Background Image if present */}
            {bgImageUrl && (
              <img
                src={bgImageUrl}
                alt="Backdrop"
                className="absolute inset-0 w-full h-full object-cover pointer-events-none opacity-40"
              />
            )}

            {/* Canvas Interactive Elements */}
            {elements.map((el) => {
              const isSel = el.id === selectedId;
              const leftPct = (el.x / canvasWidth) * 100;
              const topPct = (el.y / canvasHeight) * 100;
              const widthPct = (el.width / canvasWidth) * 100;
              const heightPct = (el.height / canvasHeight) * 100;

              return (
                <div
                  key={el.id}
                  onMouseDown={(e) => handleMouseDownElement(e, el)}
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedId(el.id);
                    setActiveTool('properties');
                  }}
                  style={{
                    position: 'absolute',
                    left: `${leftPct}%`,
                    top: `${topPct}%`,
                    width: `${widthPct}%`,
                    height: `${heightPct}%`,
                    zIndex: el.zIndex,
                    cursor: isDragging && isSel ? 'grabbing' : 'grab'
                  }}
                  className={`group transition-shadow ${
                    isSel ? 'ring-2 ring-emerald-500 ring-offset-1 shadow-xl' : 'hover:ring-1 hover:ring-black/20'
                  }`}
                >
                  {/* TEXT ELEMENT */}
                  {el.type === 'text' && (
                    <div 
                      className="w-full h-full flex flex-col justify-start overflow-hidden px-1 py-0.5"
                      style={{
                        backgroundColor: el.bgColor || 'transparent',
                        borderRadius: el.bgColor ? '6px' : '0px'
                      }}
                    >
                      <span 
                        style={{
                          color: el.textColor || '#0F172A',
                          fontSize: `clamp(9px, ${(el.fontSize || 16) / 12}vw, ${(el.fontSize || 16) * 1.5}px)`,
                          fontFamily: el.fontFamily === 'serif' ? 'Georgia, serif' : el.fontFamily === 'mono' ? 'monospace' : "'Plus Jakarta Sans', sans-serif",
                          fontWeight: el.fontWeight === 'extrabold' ? 800 : el.fontWeight === 'bold' ? 700 : 400,
                          textAlign: el.textAlign || 'left',
                          whiteSpace: 'pre-line',
                          lineHeight: 1.25
                        }}
                      >
                        {el.text}
                      </span>
                    </div>
                  )}

                  {/* CODE ELEMENT */}
                  {el.type === 'code' && (
                    <div 
                      className="w-full h-full p-2.5 rounded-xl flex flex-col justify-start overflow-hidden shadow-inner border border-slate-700/80"
                      style={{
                        backgroundColor: el.fillColor || '#0F172A',
                        color: el.textColor || '#F8FAFC',
                        borderRadius: `${el.borderRadius || 12}px`
                      }}
                    >
                      <div className="flex items-center justify-between pb-1.5 border-b border-slate-700/60 mb-1">
                        <div className="flex items-center gap-1.5">
                          <span className="w-2 h-2 rounded-full bg-red-500 inline-block" />
                          <span className="w-2 h-2 rounded-full bg-yellow-500 inline-block" />
                          <span className="w-2 h-2 rounded-full bg-green-500 inline-block" />
                        </div>
                        <span className="text-[9px] font-mono font-bold tracking-wider text-slate-400 uppercase">
                          {el.codeLanguage || 'PYTHON'}
                        </span>
                      </div>
                      {el.accentText && (
                        <div className="text-[10px] font-bold text-sky-400 uppercase tracking-wide truncate mb-1">
                          {el.accentText}
                        </div>
                      )}
                      <pre className="flex-1 font-mono text-[10px] leading-relaxed text-sky-200 overflow-x-auto whitespace-pre font-medium">
                        {el.codeText || el.text}
                      </pre>
                    </div>
                  )}

                  {/* SHAPE ELEMENT */}
                  {el.type === 'shape' && (

                    <div 
                      className="w-full h-full relative"
                      style={{
                        backgroundColor: el.fillColor || 'transparent',
                        borderColor: el.borderColor || 'transparent',
                        borderWidth: `${el.borderWidth || 0}px`,
                        borderStyle: 'solid',
                        borderRadius: el.shapeType === 'circle' ? '9999px' : `${el.borderRadius || 0}px`,
                        opacity: el.opacity ?? 1,
                        boxShadow: el.shadow ? '0 4px 6px -1px rgba(0, 0, 0, 0.08), 0 2px 4px -2px rgba(0, 0, 0, 0.05)' : 'none'
                      }}
                    >
                      {/* Sticky Note Pin / Accent Header */}
                      {el.shapeType === 'sticky' && el.accentText && (
                        <div className="absolute top-1 left-2 text-[9px] font-extrabold uppercase tracking-wider text-stone-500 opacity-60">
                          {el.accentText}
                        </div>
                      )}

                      {/* Diamond rotation overlay */}
                      {el.shapeType === 'diamond' && (
                        <div className="w-full h-full transform rotate-45 border-2 border-blue-600 bg-white" />
                      )}

                      {/* Directional Arrow rendering */}
                      {el.shapeType === 'arrow' && (
                        <div className="w-full h-full flex items-center justify-center">
                          <ArrowRight className="w-full h-full text-blue-600" />
                        </div>
                      )}
                    </div>
                  )}

                  {/* IMAGE ELEMENT */}
                  {el.type === 'image' && (
                    <img 
                      src={el.imageUrl}
                      alt={el.imageAlt || 'Canvas image'}
                      className="w-full h-full object-cover pointer-events-none"
                      style={{
                        borderRadius: `${el.borderRadius || 0}px`
                      }}
                    />
                  )}

                  {/* ICON / EMOJI ELEMENT */}
                  {el.type === 'icon' && (
                    <div className="w-full h-full flex items-center justify-center select-none">
                      <span style={{ fontSize: `${el.fontSize || 36}px` }}>
                        {el.iconText}
                      </span>
                    </div>
                  )}

                  {/* RESIZE HANDLE */}
                  {isSel && (
                    <div
                      onMouseDown={(e) => handleResizeStart(e, 'se')}
                      className="absolute -bottom-1.5 -right-1.5 w-3.5 h-3.5 bg-emerald-500 border-2 border-white rounded-full cursor-se-resize shadow-md z-50"
                      title="Drag to resize"
                    />
                  )}
                </div>
              );
            })}

          </div>

          <div className="flex items-center justify-between text-[11px] text-stone-500 px-1">
            <span>✨ Pixel-calibrated for LinkedIn Desktop & Mobile</span>
            <span className="font-mono">{elements.length} Elements on Canvas</span>
          </div>

        </div>

      </div>

    </div>
  );
};
