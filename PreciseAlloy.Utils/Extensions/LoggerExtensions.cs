using System.Runtime.CompilerServices;
using Microsoft.Extensions.Logging;

// ReSharper disable UnusedMember.Global

namespace PreciseAlloy.Utils.Extensions;

public static class LoggerExtensions
{
    // ReSharper disable once ConvertToConstant.Local
    private static readonly LogLevel LogLevel = LogLevel.Trace;

    /// <summary>
    /// Log the enter of constructor
    /// </summary>
    /// <param name="logger">The logger</param>
    /// <param name="callerMemberName">The method name, this parameter will be filled by compiler automatically</param>
    /// <param name="callerFilePath">The file path, this parameter will be filled by compiler automatically</param>
    /// <param name="callerLineNumber">The line number, this parameter will be filled by compiler automatically</param>
    public static void EnterConstructor(
        this ILogger logger,
        [CallerMemberName] string callerMemberName = "",
        [CallerFilePath] string callerFilePath = "",
        [CallerLineNumber] int callerLineNumber = 0)
    {
        logger.Log(
            LogLevel,
            "Enter constructor `{callerMemberName}`, file `{callerFilePath}`, line {callerLineNumber}.",
            callerMemberName,
            callerFilePath,
            callerLineNumber);
    }

    /// <summary>
    /// Log the enter of method
    /// </summary>
    /// <param name="logger">The logger</param>
    /// <param name="callerMemberName">The method name, this parameter will be filled by compiler automatically</param>
    /// <param name="callerFilePath">The file path, this parameter will be filled by compiler automatically</param>
    /// <param name="callerLineNumber">The line number, this parameter will be filled by compiler automatically</param>
    public static void EnterMethod(
        this ILogger logger,
        [CallerMemberName] string callerMemberName = "",
        [CallerFilePath] string callerFilePath = "",
        [CallerLineNumber] int callerLineNumber = 0)
    {
        logger.Log(
            LogLevel,
            "Enter method `{callerMemberName}`, file `{callerFilePath}`, line {callerLineNumber}.",
            callerMemberName,
            callerFilePath,
            callerLineNumber);
    }

    /// <summary>
    /// Log the exit of constructor
    /// </summary>
    /// <param name="logger">The logger</param>
    /// <param name="callerMemberName">The method name, this parameter will be filled by compiler automatically</param>
    /// <param name="callerFilePath">The file path, this parameter will be filled by compiler automatically</param>
    /// <param name="callerLineNumber">The line number, this parameter will be filled by compiler automatically</param>
    public static void ExitConstructor(
        this ILogger logger,
        [CallerMemberName] string callerMemberName = "",
        [CallerFilePath] string callerFilePath = "",
        [CallerLineNumber] int callerLineNumber = 0)
    {
        logger.Log(
            LogLevel, "Exit constructor `{callerMemberName}`, file `{callerFilePath}`, line {callerLineNumber}.",
            callerMemberName,
            callerFilePath,
            callerLineNumber);
    }

    /// <summary>
    /// Log the exit of method
    /// </summary>
    /// <param name="logger">The logger</param>
    /// <param name="message">The additional message for the exit action</param>
    /// <param name="callerMemberName">The method name, this parameter will be filled by compiler automatically</param>
    /// <param name="callerFilePath">The file path, this parameter will be filled by compiler automatically</param>
    /// <param name="callerLineNumber">The line number, this parameter will be filled by compiler automatically</param>
    public static void ExitMethod(
        this ILogger logger,
        string? message = null,
        [CallerMemberName] string callerMemberName = "",
        [CallerFilePath] string callerFilePath = "",
        [CallerLineNumber] int callerLineNumber = 0)
    {
        logger.Log(
            LogLevel,
            "Exit method `{callerMemberName}`, message: `{message}`, file `{callerFilePath}`, line {callerLineNumber}.",
            message,
            callerMemberName,
            callerFilePath,
            callerLineNumber);
    }

    /// <summary>
    /// Log the cache reading
    /// </summary>
    /// <param name="logger">The logger</param>
    /// <param name="cacheKey">The cache key</param>
    /// <param name="callerMemberName">The method name, this parameter will be filled by compiler automatically</param>
    /// <param name="callerFilePath">The file path, this parameter will be filled by compiler automatically</param>
    /// <param name="callerLineNumber">The line number, this parameter will be filled by compiler automatically</param>
    public static void ReadCache(
        this ILogger logger,
        string cacheKey,
        [CallerMemberName] string callerMemberName = "",
        [CallerFilePath] string callerFilePath = "",
        [CallerLineNumber] int callerLineNumber = 0)
    {
        logger.Log(
            LogLevel,
            "Read cache key `{cacheKey}` in `{callerMemberName}`, file `{callerFilePath}`, line {callerLineNumber}.",
            cacheKey,
            callerMemberName,
            callerFilePath,
            callerLineNumber);
    }

    /// <summary>
    /// Log the cache writing
    /// </summary>
    /// <param name="logger">The logger</param>
    /// <param name="cacheKey">The cache key</param>
    /// <param name="callerMemberName">The method name, this parameter will be filled by compiler automatically</param>
    /// <param name="callerFilePath">The file path, this parameter will be filled by compiler automatically</param>
    /// <param name="callerLineNumber">The line number, this parameter will be filled by compiler automatically</param>
    public static void WriteCache(
        this ILogger logger,
        string cacheKey,
        [CallerMemberName] string callerMemberName = "",
        [CallerFilePath] string callerFilePath = "",
        [CallerLineNumber] int callerLineNumber = 0)
    {
        logger.Log(
            LogLevel,
            "Write cache key `{cacheKey}` in `{callerMemberName}`, file `{callerFilePath}`, line {callerLineNumber}.",
            cacheKey,
            callerMemberName,
            callerFilePath,
            callerLineNumber);
    }

    /// <summary>
    /// Log the cache removing
    /// </summary>
    /// <param name="logger">The logger</param>
    /// <param name="cacheKey">The cache key</param>
    /// <param name="callerMemberName">The method name, this parameter will be filled by compiler automatically</param>
    /// <param name="callerFilePath">The file path, this parameter will be filled by compiler automatically</param>
    /// <param name="callerLineNumber">The line number, this parameter will be filled by compiler automatically</param>
    public static void RemoveCache(
        this ILogger logger,
        string cacheKey,
        [CallerMemberName] string callerMemberName = "",
        [CallerFilePath] string callerFilePath = "",
        [CallerLineNumber] int callerLineNumber = 0)
    {
        logger.Log(
            LogLevel,
            "Remove cache key `{cacheKey}` in `{callerMemberName}`, file `{callerFilePath}`, line {callerLineNumber}.",
            cacheKey,
            callerMemberName,
            callerFilePath,
            callerLineNumber);
    }

    /// <summary>
    /// Log the cache dirty
    /// </summary>
    /// <param name="logger">The logger</param>
    /// <param name="cacheType">The cache type</param>
    /// <param name="callerMemberName">The method name, this parameter will be filled by compiler automatically</param>
    /// <param name="callerFilePath">The file path, this parameter will be filled by compiler automatically</param>
    /// <param name="callerLineNumber">The line number, this parameter will be filled by compiler automatically</param>
    public static void DirtyCache(
        this ILogger logger,
        Type cacheType,
        [CallerMemberName] string callerMemberName = "",
        [CallerFilePath] string callerFilePath = "",
        [CallerLineNumber] int callerLineNumber = 0)
    {
        var cacheTypeFullName = cacheType.FullName;
        
        logger.Log(
            LogLevel,
            "Dirty cache type `{cacheTypeFullName}` in `{callerMemberName}`, file `{callerFilePath}`, line {callerLineNumber}.",
            cacheTypeFullName, 
            callerMemberName,
            callerFilePath,
            callerLineNumber);
    }
}