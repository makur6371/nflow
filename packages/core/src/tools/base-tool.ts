/**
 * 基础工具类
 * 所有工具继承此类
 */

export interface ToolParams {
  [key: string]: any;
}

export interface ToolResult {
  success: boolean;
  data?: any;
  error?: string;
}

export abstract class BaseTool<TParams extends ToolParams, TResult extends ToolResult> {
  constructor(
    public readonly id: string,
    public readonly name: string,
    public readonly description: string,
    public readonly icon?: string
  ) {}

  /**
   * 执行工具
   */
  abstract execute(params: TParams): Promise<TResult>;

  /**
   * 验证参数
   */
  protected validateParams(params: TParams): boolean {
    return params !== null && params !== undefined;
  }

  /**
   * 创建成功结果
   */
  protected success(data?: any): TResult {
    return { success: true, data } as TResult;
  }

  /**
   * 创建失败结果
   */
  protected failure(error: string): TResult {
    return { success: false, error } as TResult;
  }
}