import { ToolConfig } from "./allTools.js";
import { agents } from "../index.js";

interface GetTeamArgs {
    agentName?: string; // Optional - if not provided, returns full org structure
}

export const getTeamTool: ToolConfig<GetTeamArgs> = {
    definition: {
        type: "function",
        function: {
            name: "get_team_structure",
            description: "Retrieves the organizational structure of the AI agents",
            parameters: {
                type: "object",
                properties: {
                    agentName: {
                        type: "string",
                        description: "Optional: Get team structure for a specific agent. If not provided, returns full org structure."
                    }
                },
                required: []
            }
        }
    },
    handler: async (args: GetTeamArgs) => {
        try {
            if (args.agentName) {
                const agent = agents[args.agentName];
                if (!agent) {
                    throw new Error(`Agent "${args.agentName}" not found`);
                }
                return formatTeamStructure(args.agentName);
            }

            // Return full org structure starting from CEO
            return formatTeamStructure("CEO");
        } catch (error) {
            return `Error getting team structure: ${error instanceof Error ? error.message : 'Unknown error'}`;
        }
    }
};

function formatTeamStructure(agentName: string, depth = 0): string {
    const agent = agents[agentName];
    if (!agent) return "";

    const indent = "  ".repeat(depth);
    let output = `${indent}${agentName}\n`;

    // Find and sort subordinates
    const subordinates = Object.entries(agents)
        .filter(([_, a]) => a.metadata.managerAssistantId === agent.assistant.id)
        .map(([name]) => name);

    // Recursively format each subordinate
    for (const subordinateName of subordinates) {
        output += formatTeamStructure(subordinateName, depth + 1);
    }

    return output;
} 