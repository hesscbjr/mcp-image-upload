#!/usr/bin/env node
import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { CallToolRequestSchema, ListToolsRequestSchema } from "@modelcontextprotocol/sdk/types.js";
import dotenv from 'dotenv';
import { ImgurUploader } from './uploaders/imgur.js';

// Load environment variables
dotenv.config();

// Initialize uploader
const uploader = new ImgurUploader(process.env.IMGUR_CLIENT_ID!);

// Create server
const server = new Server({
  name: "mcp-image-upload",
  version: "1.0.0"
}, {
  capabilities: {
    tools: {}
  }
});

// List available tools
server.setRequestHandler(ListToolsRequestSchema, async () => {
  return {
    tools: [{
      name: "upload_image",
      description: "Upload an image file and get a public URL",
      inputSchema: {
        type: "object",
        properties: {
          filepath: {
            type: "string",
            description: "The absolute path to the image file"
          }
        },
        required: ["filepath"]
      }
    }]
  };
});

// Handle tool calls
server.setRequestHandler(CallToolRequestSchema, async (request) => {
  if (request.params.name === "upload_image") {
    const { filepath } = request.params.arguments as { filepath: string };
    
    try {
      console.error(`Uploading image: ${filepath}`); // Log to stderr
      const url = await uploader.upload(filepath);
      
      return {
        content: [
          {
            type: "text",
            text: `Image uploaded successfully! URL: ${url}`
          }
        ]
      };
    } catch (error) {
      return {
        content: [
          {
            type: "text",
            text: `Error uploading image: ${error instanceof Error ? error.message : 'Unknown error'}`
          }
        ],
        isError: true
      };
    }
  }
  
  throw new Error(`Unknown tool: ${request.params.name}`);
});

// Start server
async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error('MCP Image Upload Server started'); // Log to stderr
}

main().catch((error) => {
  console.error('Server error:', error);
  process.exit(1);
});