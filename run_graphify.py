import json
from pathlib import Path
from graphify.detect import detect
from graphify.extract import collect_files, extract
from graphify.build import build_from_json
from graphify.cluster import cluster, score_all
from graphify.analyze import god_nodes, surprising_connections, suggest_questions
from graphify.report import generate
from graphify.export import to_json

src_path = Path("t:/r_lib/connect.me/src")

print("Step 1: Detecting files...")
result = detect(src_path)
print(f"Detected {result['total_files']} files")

print("\nStep 2: Extracting code files (AST)...")
code_files = []
for f in result.get('files', {}).get('code', []):
    p = Path(f)
    if p.is_dir():
        code_files.extend(collect_files(p))
    else:
        code_files.append(p)

if code_files:
    extraction = extract(code_files)
    print(f"AST: {len(extraction['nodes'])} nodes, {len(extraction['edges'])} edges")
else:
    extraction = {'nodes': [], 'edges': [], 'hyperedges': []}

print("\nStep 3: Building graph...")
G = build_from_json(extraction)
print(f"Graph: {G.number_of_nodes()} nodes, {G.number_of_edges()} edges")

print("\nStep 4: Clustering...")
communities = cluster(G)
cohesion = score_all(G, communities)

print("\nStep 5: Analyzing...")
gods = god_nodes(G)
surprises = surprising_connections(G, communities)

print("\nStep 6: Generating outputs...")
output_dir = Path("graphify-out")
output_dir.mkdir(exist_ok=True)

labels = {cid: f'Community {cid}' for cid in communities}
questions = suggest_questions(G, communities, labels)

token_cost = {'input': extraction.get('input_tokens', 0), 'output': extraction.get('output_tokens', 0)}
report = generate(G, communities, cohesion, labels, gods, surprises, result, 
                  token_cost, str(src_path), suggested_questions=questions)
(output_dir / 'GRAPH_REPORT.md').write_text(report, encoding='utf-8')

to_json(G, communities, str(output_dir / 'graph.json'))

print("\nDone! Outputs generated in graphify-out/")
print("- GRAPH_REPORT.md")
print("- graph.json")
