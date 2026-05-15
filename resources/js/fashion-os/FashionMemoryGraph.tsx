import React, { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Network, 
  Brain, 
  Database, 
  Zap, 
  Maximize2, 
  Minimize2, 
  Search,
  Filter,
  Layers,
  ChevronRight,
  Target,
  Box,
  Cpu,
  Share2
} from 'lucide-react';

interface Node extends d3.SimulationNodeDatum {
  id: string;
  group: number;
  label: string;
  val: number;
}

interface Link extends d3.SimulationLinkDatum<Node> {
  source: string | Node;
  target: string | Node;
  value: number;
}

const INITIAL_DATA = {
  nodes: [
    { id: 'BRAIN', group: 1, label: 'Fashion Core', val: 30 },
    { id: 'TREND_01', group: 2, label: 'Cyber_Minimalism', val: 20 },
    { id: 'TREND_02', group: 2, label: 'Bio_Tech_Silk', val: 18 },
    { id: 'TREND_03', group: 2, label: 'Brutalist_Grey', val: 22 },
    { id: 'ASSET_01', group: 3, label: 'Mesh_Tee_v1', val: 12 },
    { id: 'ASSET_02', group: 3, label: 'Silk_Blouse_v4', val: 15 },
    { id: 'MODEL_01', group: 4, label: 'CYBER_EVE', val: 25 },
    { id: 'MODEL_02', group: 4, label: 'NEO_ADAM', val: 24 },
  ],
  links: [
    { source: 'BRAIN', target: 'TREND_01', value: 2 },
    { source: 'BRAIN', target: 'TREND_02', value: 2 },
    { source: 'BRAIN', target: 'TREND_03', value: 2 },
    { source: 'TREND_01', target: 'ASSET_01', value: 1 },
    { source: 'TREND_02', target: 'ASSET_02', value: 1 },
    { source: 'ASSET_01', target: 'MODEL_01', value: 1 },
    { source: 'ASSET_02', target: 'MODEL_01', value: 1 },
    { source: 'TREND_03', target: 'MODEL_02', value: 1 },
  ]
};

export const FashionMemoryGraph: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  const [selectedNode, setSelectedNode] = useState<Node | null>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);

  useEffect(() => {
    if (!svgRef.current || !containerRef.current) return;

    const width = containerRef.current.clientWidth;
    const height = containerRef.current.clientHeight;

    const svg = d3.select(svgRef.current)
      .attr('viewBox', `0 0 ${width} ${height}`);

    svg.selectAll('*').remove();

    const simulation = d3.forceSimulation<Node>(INITIAL_DATA.nodes as Node[])
      .force('link', d3.forceLink<Node, Link>(INITIAL_DATA.links as any).id(d => (d as any).id).distance(150))
      .force('charge', d3.forceManyBody().strength(-300))
      .force('center', d3.forceCenter(width / 2, height / 2))
      .force('collision', d3.forceCollide<Node>().radius(d => d.val + 20));

    const g = svg.append('g');

    // Zoom behavior
    svg.call(d3.zoom<SVGSVGElement, unknown>()
      .extent([[0, 0], [width, height]])
      .scaleExtent([1/2, 8])
      .on('zoom', (event) => g.attr('transform', event.transform)));

    const link = g.append('g')
      .selectAll('line')
      .data(INITIAL_DATA.links)
      .join('line')
      .attr('stroke', '#333')
      .attr('stroke-opacity', 0.6)
      .attr('stroke-width', d => Math.sqrt(d.value) * 2);

    const node = g.append('g')
      .selectAll('g')
      .data(INITIAL_DATA.nodes)
      .join('g')
      .call(d3.drag<any, any>()
        .on('start', dragstarted)
        .on('drag', dragged)
        .on('end', dragended) as any);

    node.append('circle')
      .attr('r', d => (d as  any).val)
      .attr('fill', d => (d as any).group === 1 ? '#00ff41' : (d as any).group === 2 ? '#333' : '#111')
      .attr('stroke', d => (d as any).group === 1 ? '#00ff41' : '#333')
      .attr('stroke-width', 2)
      .style('cursor', 'pointer')
      .on('click', (event, d) => setSelectedNode(d as any));

    node.append('text')
      .attr('dy', d => (d as any).val + 15)
      .attr('text-anchor', 'middle')
      .attr('fill', '#666')
      .style('font-size', '8px')
      .style('font-family', 'monospace')
      .style('font-weight', '900')
      .style('text-transform', 'uppercase')
      .style('pointer-events', 'none')
      .text(d => (d as any).label);

    simulation.on('tick', () => {
      link
        .attr('x1', d => ((d as any).source as Node).x!)
        .attr('y1', d => ((d as any).source as Node).y!)
        .attr('x2', d => ((d as any).target as Node).x!)
        .attr('y2', d => ((d as any).target as Node).y!);

      node
        .attr('transform', d => `translate(${(d as any).x},${(d as any).y})`);
    });

    function dragstarted(event: any) {
      if (!event.active) simulation.alphaTarget(0.3).restart();
      event.subject.fx = event.subject.x;
      event.subject.fy = event.subject.y;
    }

    function dragged(event: any) {
      event.subject.fx = event.x;
      event.subject.fy = event.y;
    }

    function dragended(event: any) {
      if (!event.active) simulation.alphaTarget(0);
      event.subject.fx = null;
      event.subject.fy = null;
    }

    return () => { simulation.stop(); };
  }, []);

  return (
    <div className={`relative bg-[#050505] transition-all duration-700 ${isFullscreen ? 'fixed inset-0 z-50' : 'h-full rounded-[40px] border border-white/5 overflow-hidden'}`}>
      {/* HUD - Top */}
      <div className="absolute top-8 left-8 z-20 flex gap-4">
        <div className="bg-black/60 backdrop-blur-xl px-4 py-2 rounded-full border border-white/10 flex items-center gap-3">
          <Brain size={14} className="text-primary animate-pulse" />
          <span className="text-[9px] font-black italic tracking-widest uppercase text-white">Fashion_Memory_Graph</span>
        </div>
        <div className="flex bg-black/60 backdrop-blur-xl px-3 py-1.5 rounded-full border border-white/10 text-[8px] font-mono text-zinc-500 uppercase italic items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-primary animate-ping" />
          Node_Sync: Realtime
        </div>
      </div>

      <div className="absolute top-8 right-8 z-20 flex gap-2">
        <button className="p-2.5 rounded-full bg-black/60 border border-white/10 text-white hover:bg-primary hover:text-black transition-all">
          <Search size={14} />
        </button>
        <button 
          onClick={() => setIsFullscreen(!isFullscreen)}
          className="p-2.5 rounded-full bg-black/60 border border-white/10 text-white hover:bg-primary hover:text-black transition-all"
        >
          {isFullscreen ? <Minimize2 size={14} /> : <Maximize2 size={14} />}
        </button>
      </div>

      {/* Main Canvas Container */}
      <div ref={containerRef} className="w-full h-full cursor-crosshair">
        <svg ref={svgRef} className="w-full h-full" />
      </div>

      {/* Grid Overlay */}
      <div className="absolute inset-0 pointer-events-none bg-grid-white/[0.02] opacity-50" />

      {/* Active Selection Details Pane - Animated */}
      <AnimatePresence>
        {selectedNode && (
          <motion.div 
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 100 }}
            className="absolute top-1/2 -translate-y-1/2 right-8 w-80 bg-black/80 backdrop-blur-3xl border border-white/10 rounded-[3rem] p-8 z-30 shadow-2xl"
          >
            <div className="space-y-8">
              <header className="flex justify-between items-start">
                 <div>
                    <div className="flex items-center gap-2 text-primary mb-2">
                      <Target size={14} />
                      <span className="text-[8px] font-black uppercase tracking-widest">Active_Node</span>
                    </div>
                    <h2 className="text-3xl font-black italic uppercase leading-none tracking-tighter">{selectedNode.label}</h2>
                 </div>
                 <button onClick={() => setSelectedNode(null)} className="p-2 hover:bg-white/5 rounded-full text-zinc-500 hover:text-white transition-all">
                    <Minimize2 size={16} />
                 </button>
              </header>

              <div className="space-y-4">
                 {[
                   { label: 'NODE_ID', val: selectedNode.id },
                   { label: 'RECURSION_DEPTH', val: 'L3_PRIMARY' },
                   { label: 'STYLE_WEIGHT', val: '0.842' },
                   { label: 'SIMILARITY_SCORE', val: '92.4%' }
                 ].map(row => (
                   <div key={row.label} className="flex justify-between items-center py-2 border-b border-white/5 font-mono">
                      <span className="text-[8px] text-zinc-600 uppercase italic">{row.label}</span>
                      <span className="text-[10px] text-zinc-200">{row.val}</span>
                   </div>
                 ))}
              </div>

              <div className="grid grid-cols-2 gap-3 pt-6">
                 <button className="py-4 bg-primary text-black rounded-2xl font-black text-[10px] uppercase tracking-widest hover:scale-105 transition-all">
                    Explore_Node
                 </button>
                 <button className="p-4 bg-white/5 text-white rounded-2xl border border-white/10 hover:bg-white/10 transition-all flex items-center justify-center">
                    <Share2 size={14} />
                 </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Control Legend - Bottom */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-12 bg-black/40 backdrop-blur-md px-10 py-3 rounded-full border border-white/5">
         <div className="flex items-center gap-3">
            <div className="w-2 h-2 rounded-full bg-primary" />
            <span className="text-[8px] font-black uppercase italic text-zinc-500">Core_Intelligence</span>
         </div>
         <div className="flex items-center gap-3">
            <div className="w-2 h-2 rounded-full bg-[#333]" />
            <span className="text-[8px] font-black uppercase italic text-zinc-500">Trend_Cluster</span>
         </div>
         <div className="flex items-center gap-3">
            <div className="w-2 h-2 rounded-full bg-[#111]" />
            <span className="text-[8px] font-black uppercase italic text-zinc-500">Asset_Unit</span>
         </div>
      </div>
    </div>
  );
};
