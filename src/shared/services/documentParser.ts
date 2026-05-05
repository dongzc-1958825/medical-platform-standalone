/**
 * 文档解析服务
 * 支持 Word(.docx)、PDF、纯文本文件的文字提取
 */

import * as mammoth from 'mammoth';

// pdf-parse 需要动态导入，因为它没有默认导出
let pdfParse: any;

export const documentParser = {
  /**
   * 初始化 pdf-parse（动态导入）
   */
  initPdfParse: async () => {
    if (!pdfParse) {
      try {
        const module = await import('pdf-parse');
        // pdf-parse 可能有多种导出方式，尝试常见的形式
        pdfParse = module.default || module;
        console.log('✅ PDF解析器初始化成功');
      } catch (error) {
        console.error('❌ PDF解析器初始化失败:', error);
        throw new Error('PDF解析库加载失败');
      }
    }
    return pdfParse;
  },

  /**
   * 解析Word文档 (.docx)
   * @param file Word文件
   * @returns 提取的文本内容
   */
  parseWord: async (file: File): Promise<string> => {
    try {
      console.log('📄 开始解析Word文档:', file.name);
      const arrayBuffer = await file.arrayBuffer();
      const result = await mammoth.extractRawText({ 
        arrayBuffer: arrayBuffer 
      });
      console.log('✅ Word解析成功，文字长度:', result.value.length);
      return result.value;
    } catch (error) {
      console.error('❌ Word解析失败:', error);
      throw new Error('Word文档解析失败，请确保文件是 .docx 格式');
    }
  },

  /**
   * 解析PDF文档
   * @param file PDF文件
   * @returns 提取的文本内容
   */
  parsePDF: async (file: File): Promise<string> => {
    try {
      console.log('📄 开始解析PDF文档:', file.name);
      const pdfParseFn = await documentParser.initPdfParse();
      const arrayBuffer = await file.arrayBuffer();
      const data = await pdfParseFn(arrayBuffer);
      console.log('✅ PDF解析成功，文字长度:', data.text.length);
      return data.text;
    } catch (error) {
      console.error('❌ PDF解析失败:', error);
      throw new Error('PDF文档解析失败，请确保文件不是扫描件或图片格式');
    }
  },

  /**
   * 检查文件是否支持
   * @param file 要检查的文件
   * @returns 是否支持
   */
  isSupported: (file: File): boolean => {
    const fileName = file.name.toLowerCase();
    const fileType = file.type;
    
    // Word文档
    const isWord = fileName.endsWith('.docx') || 
                   fileName.endsWith('.doc') || 
                   fileType === 'application/msword' ||
                   fileType === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document';
    
    // PDF文档
    const isPdf = fileName.endsWith('.pdf') || fileType === 'application/pdf';
    
    // 纯文本文件
    const isText = fileType.startsWith('text/') || 
                   fileName.endsWith('.txt') || 
                   fileName.endsWith('.md') ||
                   fileName.endsWith('.json') ||
                   fileName.endsWith('.js') ||
                   fileName.endsWith('.css') ||
                   fileName.endsWith('.html') ||
                   fileName.endsWith('.xml');
    
    const supported = isWord || isPdf || isText;
    console.log(`📋 文件检查: ${fileName}, 类型: ${fileType}, 支持: ${supported}`);
    
    return supported;
  },

  /**
   * 获取文件类型描述
   * @param fileName 文件名
   * @returns 类型描述
   */
  getFileTypeDescription: (fileName: string): string => {
    const ext = fileName.split('.').pop()?.toLowerCase();
    const descriptions: Record<string, string> = {
      'docx': 'Word文档',
      'doc': 'Word文档(旧版)',
      'pdf': 'PDF文档',
      'txt': '文本文件',
      'md': 'Markdown文件',
      'json': 'JSON文件',
      'js': 'JavaScript文件',
      'css': 'CSS文件',
      'html': 'HTML文件',
      'xml': 'XML文件',
    };
    return descriptions[ext || ''] || '未知格式';
  },

  /**
   * 获取文件格式建议
   * @param fileName 文件名
   * @returns 处理建议
   */
  getFormatSuggestion: (fileName: string): string => {
    const ext = fileName.split('.').pop()?.toLowerCase();
    const suggestions: Record<string, string> = {
      'doc': '旧版Word文档，建议另存为 .docx 格式后再上传',
      'pdf': 'PDF文档将提取文字内容（不支持扫描件）',
      'jpg': '图片文件不支持，请使用OCR文字识别',
      'png': '图片文件不支持，请使用OCR文字识别',
      'wps': 'WPS文档，建议另存为 .docx 格式后再上传',
    };
    return suggestions[ext || ''] || '';
  },

  /**
   * 自动识别文件类型并解析
   * @param file 要解析的文件
   * @returns 提取的文本内容
   */
  parseDocument: async (file: File): Promise<string> => {
    const fileName = file.name.toLowerCase();
    const fileType = file.type;
    
    console.log('📄 开始解析文件:', fileName, '类型:', fileType);
    
    try {
      // Word文档
      if (fileName.endsWith('.docx') || 
          fileName.endsWith('.doc') || 
          fileType === 'application/msword' ||
          fileType === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
        return await documentParser.parseWord(file);
      }
      
      // PDF文档
      if (fileName.endsWith('.pdf') || fileType === 'application/pdf') {
        return await documentParser.parsePDF(file);
      }
      
      // 纯文本文件
      if (fileType.startsWith('text/') || 
          fileName.endsWith('.txt') || 
          fileName.endsWith('.md') ||
          fileName.endsWith('.json') ||
          fileName.endsWith('.js') ||
          fileName.endsWith('.css') ||
          fileName.endsWith('.html') ||
          fileName.endsWith('.xml')) {
        
        console.log('📄 作为文本文件读取');
        const text = await file.text();
        console.log('✅ 文本读取成功，长度:', text.length);
        return text;
      }
      
      throw new Error(`不支持的文件格式: ${fileName}`);
      
    } catch (error: any) {
      console.error('❌ 文件解析失败:', error);
      throw new Error(`解析失败: ${error.message}`);
    }
  },

  /**
   * 获取文件大小描述
   * @param bytes 字节数
   * @returns 可读的大小描述
   */
  formatFileSize: (bytes: number): string => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(2) + ' MB';
  }
};