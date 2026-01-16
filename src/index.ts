#!/usr/bin/env node

import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from "@modelcontextprotocol/sdk/types.js";
import { BilibiliApi } from "./BilibiliApi.js";

// 创建 Bilibili API 实例
const bilibiliApi = new BilibiliApi();

// 创建 MCP 服务器
const server = new Server(
  {
    name: "mcp-server-bilibili",
    version: "0.1.0",
  },
  {
    capabilities: {
      tools: {},
    },
  }
);

// 定义可用工具列表
server.setRequestHandler(ListToolsRequestSchema, async () => {
  return {
    tools: [
      {
        name: "parse_bilibili_video",
        description: "解析 Bilibili 视频链接，获取视频的完整信息，包括标题、封面、视频链接、用户信息、合集视频列表等",
        inputSchema: {
          type: "object",
          properties: {
            url: {
              type: "string",
              description: "Bilibili 视频链接，支持 b23.tv 短链接和完整链接",
            },
          },
          required: ["url"],
        },
      },
      {
        name: "get_bilibili_video_info",
        description: "获取 Bilibili 视频的详细信息，包括标题、封面、简介、用户信息、视频列表等",
        inputSchema: {
          type: "object",
          properties: {
            url: {
              type: "string",
              description: "Bilibili 视频链接",
            },
          },
          required: ["url"],
        },
      },
      {
        name: "get_bilibili_download_urls",
        description: "获取 Bilibili 视频的下载链接列表，支持合集视频",
        inputSchema: {
          type: "object",
          properties: {
            url: {
              type: "string",
              description: "Bilibili 视频链接",
            },
          },
          required: ["url"],
        },
      },
      {
        name: "get_bilibili_basic_info",
        description: "获取 Bilibili 视频的基本信息，包括标题、封面、简介、用户信息等",
        inputSchema: {
          type: "object",
          properties: {
            url: {
              type: "string",
              description: "Bilibili 视频链接",
            },
          },
          required: ["url"],
        },
      },
      {
        name: "get_bilibili_collection",
        description: "获取 Bilibili 合集中的所有视频列表信息",
        inputSchema: {
          type: "object",
          properties: {
            url: {
              type: "string",
              description: "Bilibili 视频链接（合集链接）",
            },
          },
          required: ["url"],
        },
      },
    ],
  };
});

// 处理工具调用
server.setRequestHandler(CallToolRequestSchema, async (request) => {
  try {
    const { name, arguments: args } = request.params;

    switch (name) {
      case "parse_bilibili_video": {
        const url = String(args?.url || "");
        if (!url) {
          throw new Error("视频链接不能为空");
        }
        
        const result = await bilibiliApi.parseVideo(url);
        return {
          content: [
            {
              type: "text",
              text: JSON.stringify(result, null, 2),
            },
          ],
        };
      }

      case "get_bilibili_video_info": {
        const url = String(args?.url || "");
        if (!url) {
          throw new Error("视频链接不能为空");
        }
        
        const result = await bilibiliApi.getVideoInfo(url);
        return {
          content: [
            {
              type: "text",
              text: JSON.stringify(result, null, 2),
            },
          ],
        };
      }

      case "get_bilibili_download_urls": {
        const url = String(args?.url || "");
        if (!url) {
          throw new Error("视频链接不能为空");
        }
        
        const result = await bilibiliApi.getVideoDownloadUrls(url);
        return {
          content: [
            {
              type: "text",
              text: JSON.stringify(result, null, 2),
            },
          ],
        };
      }

      case "get_bilibili_basic_info": {
        const url = String(args?.url || "");
        if (!url) {
          throw new Error("视频链接不能为空");
        }
        
        const result = await bilibiliApi.getVideoBasicInfo(url);
        return {
          content: [
            {
              type: "text",
              text: JSON.stringify(result, null, 2),
            },
          ],
        };
      }

      case "get_bilibili_collection": {
        const url = String(args?.url || "");
        if (!url) {
          throw new Error("视频链接不能为空");
        }
        
        const result = await bilibiliApi.getCollectionVideos(url);
        return {
          content: [
            {
              type: "text",
              text: JSON.stringify(result, null, 2),
            },
          ],
        };
      }

      default:
        throw new Error(`未知工具: ${name}`);
    }
  } catch (error: any) {
    return {
      content: [
        {
          type: "text",
          text: JSON.stringify(
            {
              error: true,
              message: error.message,
              tool: request.params.name,
              arguments: request.params.arguments,
            },
            null,
            2
          ),
        },
      ],
      isError: true,
    };
  }
});

// 启动服务器
async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error("Bilibili MCP 服务器已启动");
}

main().catch((error) => {
  console.error("服务器启动失败", error);
  process.exit(1);
});