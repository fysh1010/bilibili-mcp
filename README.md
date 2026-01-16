# Bilibili MCP Server

一个用于解析哔哩哔哩（Bilibili）视频的 Model Context Protocol (MCP) 服务器，支持视频信息提取、下载链接获取和合集解析等功能。

## 功能特性

- ✅ 解析 Bilibili 视频链接（支持 b23.tv 短链接）
- ✅ 获取视频详细信息（标题、封面、简介、用户信息等）
- ✅ 获取视频下载链接（1080P 画质）
- ✅ 支持合集视频解析
- ✅ 获取合集视频列表

## 安装

### 方式一：使用 npx（推荐）

无需安装，直接运行：

```json
{
  "mcpServers": {
    "bilibili": {
      "command": "npx",
      "args": ["-y", "mcp-server-bilibili"]
    }
  }
}
```

### 方式二：全局安装

```bash
npm install -g mcp-server-bilibili
```

然后在配置文件中使用：

```json
{
  "mcpServers": {
    "bilibili": {
      "command": "mcp-server-bilibili"
    }
  }
}
```

### 方式三：从源码运行

```bash
# 克隆仓库
git clone https://github.com/fysh1010/bilibili-mcp.git
cd bilibili-mcp

# 安装依赖
npm install

# 构建
npm run build
```

然后在配置文件中使用：

```json
{
  "mcpServers": {
    "bilibili": {
      "command": "node",
      "args": ["E:\\path\\to\\bilibili-mcp\\build\\index.js"]
    }
  }
}
```

## 配置 Claude Desktop

### Windows

1. 打开 Claude Desktop 配置文件：
   ```
   %APPDATA%\Claude\claude_desktop_config.json
   ```

2. 添加以下配置：

```json
{
  "mcpServers": {
    "bilibili": {
      "command": "npx",
      "args": ["-y", "mcp-server-bilibili"]
    }
  }
}
```

3. 重启 Claude Desktop

### macOS

1. 打开 Claude Desktop 配置文件：
   ```
   ~/Library/Application Support/Claude/claude_desktop_config.json
   ```

2. 添加以下配置：

```json
{
  "mcpServers": {
    "bilibili": {
      "command": "npx",
      "args": ["-y", "mcp-server-bilibili"]
    }
  }
}
```

3. 重启 Claude Desktop

### Linux

1. 打开 Claude Desktop 配置文件：
   ```
   ~/.config/Claude/claude_desktop_config.json
   ```

2. 添加以下配置：

```json
{
  "mcpServers": {
    "bilibili": {
      "command": "npx",
      "args": ["-y", "mcp-server-bilibili"]
    }
  }
}
```

3. 重启 Claude Desktop

## 可用工具

### 1. parse_bilibili_video

解析 Bilibili 视频链接，获取完整信息。

**参数：**
- `url` (必填): Bilibili 视频链接，支持 b23.tv 短链接

**示例：**
```
请解析这个 Bilibili 视频：https://b23.tv/XhtfoyZ
```

**返回数据：**
```json
{
  "code": 200,
  "msg": "解析成功！",
  "data": {
    "title": "视频标题",
    "cover": "封面图片URL",
    "description": "视频简介",
    "url": "视频下载链接",
    "user": {
      "name": "UP主名称",
      "avatar": "UP主头像URL"
    },
    "videos": [
      {
        "title": "视频标题",
        "duration": 视频时长（秒）,
        "durationFormat": "04:45:58",
        "url": "视频下载链接",
        "index": 1
      }
    ],
    "totalVideos": 2
  }
}
```

### 2. get_bilibili_video_info

获取 Bilibili 视频的详细信息。

**参数：**
- `url` (必填): Bilibili 视频链接

**示例：**
```
获取这个视频的详细信息：https://b23.tv/XhtfoyZ
```

### 3. get_bilibili_download_urls

获取 Bilibili 视频的下载链接列表。

**参数：**
- `url` (必填): Bilibili 视频链接

**示例：**
```
获取这个视频的下载链接：https://b23.tv/XhtfoyZ
```

### 4. get_bilibili_basic_info

获取 Bilibili 视频的基本信息。

**参数：**
- `url` (必填): Bilibili 视频链接

**示例：**
```
获取这个视频的基本信息：https://b23.tv/XhtfoyZ
```

### 5. get_bilibili_collection

获取 Bilibili 合集中的所有视频列表信息。

**参数：**
- `url` (必填): Bilibili 视频链接（合集链接）

**示例：**
```
获取这个合集的所有视频：https://b23.tv/XhtfoyZ
```

## 使用示例

### 示例 1：解析单个视频

**用户输入：**
```
帮我解析这个 Bilibili 视频：https://b23.tv/XhtfoyZ
```

**Claude 会自动调用：**
- `parse_bilibili_video` 工具

**返回结果：**
视频的完整信息，包括标题、封面、下载链接、UP主信息等。

### 示例 2：获取下载链接

**用户输入：**
```
获取这个视频的下载链接：https://b23.tv/XhtfoyZ
```

**Claude 会自动调用：**
- `get_bilibili_download_urls` 工具

**返回结果：**
视频下载链接列表，包括合集中的所有视频。

### 示例 3：查看合集视频

**用户输入：**
```
这个合集有哪些视频？https://b23.tv/XhtfoyZ
```

**Claude 会自动调用：**
- `get_bilibili_collection` 工具

**返回结果：**
合集中的所有视频列表，包括每个视频的标题和时长。

## 测试

使用 MCP Inspector 测试工具：

```bash
npm run inspector
```

这会启动一个交互式测试界面，您可以测试所有可用的工具。

## 开发

### 项目结构

```
bilibili-mcp/
├── src/
│   ├── BilibiliApi.ts    # Bilibili API 封装层
│   └── index.ts          # MCP 服务器主入口
├── build/                # 编译输出目录
├── package.json          # 项目配置
├── tsconfig.json         # TypeScript 配置
└── README.md            # 项目说明
```

### 构建项目

```bash
npm run build
```

### 监听模式开发

```bash
npm run watch
```

## API 说明

本 MCP Server 使用第三方 API：`https://api.bugpk.com/api/bilibili`

**支持的特性：**
- ✅ 解析 Bilibili 短视频
- ✅ 画质为 1080P
- ✅ 支持合集视频
- ✅ 支持 b23.tv 短链接

## 注意事项

1. **视频链接格式**：支持完整的 Bilibili 链接和 b23.tv 短链接
2. **画质限制**：当前仅支持 1080P 画质
3. **API 限制**：使用第三方 API，可能会有调用频率限制
4. **版权说明**：请遵守 Bilibili 的用户协议和版权规定，仅用于个人学习和研究目的

## 故障排除

### 问题：无法连接到 MCP Server

**解决方案：**
1. 检查 Claude Desktop 配置文件是否正确
2. 确认网络连接正常
3. 查看 Claude Desktop 日志获取详细错误信息

### 问题：解析视频失败

**解决方案：**
1. 确认视频链接格式正确
2. 检查视频是否为公开视频
3. 确认第三方 API 服务是否正常

### 问题：npx 命令执行缓慢

**解决方案：**
- 使用全局安装方式：`npm install -g mcp-server-bilibili`
- 或者从源码运行

## 许可证

MIT License

## 贡献

欢迎提交 Issue 和 Pull Request！

## 联系方式

- GitHub: https://github.com/fysh1010/bilibili-mcp
- Issues: https://github.com/fysh1010/bilibili-mcp/issues

## 致谢

- [Model Context Protocol](https://modelcontextprotocol.io/)
- [Bilibili](https://www.bilibili.com/)
- [API 提供方](https://api.bugpk.com/)