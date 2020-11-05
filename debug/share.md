---
theme: gaia
_class: lead
paginate: true
backgroundColor: #fff
backgroundImage: url('https://marp.app/assets/hero-background.jpg')
---

# **Webpack Loader**

doBuild -> loader -> processResult

---

# **Normal Loader 和 Pitch Loader**

```
|- a-loader `pitch`
  |- b-loader `pitch`
    |- c-loader `pitch`
      |- requested module is picked up as a dependency
    |- c-loader normal execution
  |- b-loader normal execution
|- a-loader normal execution
```
```
|- a-loader `pitch`
  |- b-loader `pitch` returns a module
|- a-loader normal execution
```

---

# **Tapable**

---
```typescript
interface HookInterceptor<T, R> {
	name?: string;
	// 是否需要把context传入进行更改
	context?: boolean;
	// 每个 监听回调执行前 执行（可以操作context）
	tap?: (tap: Tap) => void;
	// 在所有 监听函数执行器 调用（可以操作context）
	call?: (...args: any[]) => void;
	loop?: (...args: any[]) => void;
	error?: (err: Error) => void;
	result?: (result: R) => void;
	// 每个 监听回调结束后 触发
	done?: () => void;
	// 插入监听回调时处理 options（返回undefined则不改变ooptions）
	register?: (options: any) => any
}
```