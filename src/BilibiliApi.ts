import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config();

const API_BASE = "https://api.bugpk.com/api";

/**
 * Bilibili API 封装类
 * 提供 Bilibili 视频解析、搜索等功能
 */
export class BilibiliApi {
  private axiosInstance: any;
  private baseUrl: string;

  constructor(baseUrl: string = API_BASE) {
    this.baseUrl = baseUrl;
    this.init();
  }

  /**
   * 初始化 axios 实例
   */
  private init(): void {
    this.axiosInstance = axios.create({
      baseURL: this.baseUrl,
      timeout: 60000,
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept': 'application/json'
      }
    });
  }

  /**
   * 处理 API 响应
   */
  private handleResponse(response: any): any {
    const { data } = response;
    
    if (data.code === 200) {
      return data;
    } else {
      throw new Error(`API 错误: ${data.msg || data.message || '未知错误'}`);
    }
  }

  /**
   * 解析 Bilibili 视频链接
   * @param url Bilibili 视频链接（支持 b23.tv 短链接）
   * @returns 视频信息，包括标题、封面、视频链接、用户信息等
   */
  public async parseVideo(url: string): Promise<any> {
    try {
      if (!url) {
        throw new Error("视频链接不能为空");
      }

      // 验证 URL 格式
      if (!url.includes('bilibili.com') && !url.includes('b23.tv')) {
        throw new Error("请提供有效的 Bilibili 视频链接");
      }

      const response = await this.axiosInstance.get('/bilibili', {
        params: { url }
      });

      return this.handleResponse(response);
    } catch (error: any) {
      throw new Error(`解析视频失败: ${error.message}`);
    }
  }

  /**
   * 获取视频详细信息
   * @param url Bilibili 视频链接
   * @returns 完整的视频信息
   */
  public async getVideoInfo(url: string): Promise<any> {
    try {
      const result = await this.parseVideo(url);
      
      if (!result.data) {
        throw new Error("未获取到视频信息");
      }

      return {
        code: result.code,
        msg: result.msg,
        data: {
          title: result.data.title,
          cover: result.data.cover,
          description: result.data.description,
          url: result.data.url,
          user: {
            name: result.data.user?.name,
            avatar: result.data.user?.avatar
          },
          videos: result.data.videos || [],
          totalVideos: result.data.totalVideos || 0
        }
      };
    } catch (error: any) {
      throw new Error(`获取视频信息失败: ${error.message}`);
    }
  }

  /**
   * 获取视频下载链接
   * @param url Bilibili 视频链接
   * @returns 视频下载链接列表
   */
  public async getVideoDownloadUrls(url: string): Promise<any> {
    try {
      const result = await this.parseVideo(url);
      
      if (!result.data || !result.data.videos) {
        throw new Error("未获取到视频下载链接");
      }

      const downloadUrls = result.data.videos.map((video: any, index: number) => ({
        index: video.index || index + 1,
        title: video.title,
        duration: video.duration,
        durationFormat: video.durationFormat,
        url: video.url
      }));

      return {
        code: result.code,
        msg: result.msg,
        total: result.data.totalVideos || downloadUrls.length,
        videos: downloadUrls
      };
    } catch (error: any) {
      throw new Error(`获取下载链接失败: ${error.message}`);
    }
  }

  /**
   * 获取视频基本信息
   * @param url Bilibili 视频链接
   * @returns 视频的基本信息（标题、封面、用户等）
   */
  public async getVideoBasicInfo(url: string): Promise<any> {
    try {
      const result = await this.parseVideo(url);
      
      if (!result.data) {
        throw new Error("未获取到视频信息");
      }

      return {
        code: result.code,
        msg: result.msg,
        data: {
          title: result.data.title,
          cover: result.data.cover,
          description: result.data.description,
          user: {
            name: result.data.user?.name,
            avatar: result.data.user?.avatar
          },
          totalVideos: result.data.totalVideos || 0
        }
      };
    } catch (error: any) {
      throw new Error(`获取基本信息失败: ${error.message}`);
    }
  }

  /**
   * 获取合集视频列表
   * @param url Bilibili 视频链接
   * @returns 合集中的所有视频信息
   */
  public async getCollectionVideos(url: string): Promise<any> {
    try {
      const result = await this.parseVideo(url);
      
      if (!result.data || !result.data.videos) {
        throw new Error("未获取到视频列表");
      }

      const collection = result.data.videos.map((video: any, index: number) => ({
        index: video.index || index + 1,
        title: video.title,
        duration: video.duration,
        durationFormat: video.durationFormat
      }));

      return {
        code: result.code,
        msg: result.msg,
        collectionTitle: result.data.title,
        totalVideos: result.data.totalVideos || collection.length,
        videos: collection
      };
    } catch (error: any) {
      throw new Error(`获取合集视频失败: ${error.message}`);
    }
  }
}