import { Command } from 'commander';
import { initDatabase, RhythmManager, NovelRepository } from '@nflow/core';

export const rhythmCommand = new Command('rhythm')
  .description('Analyze and manage chapter rhythm')
  .option('-a, --analyze <chapter>', 'Analyze chapter rhythm')
  .option('-v, --visualize <chapter>', 'Visualize chapter rhythm')
  .option('-q, --quality <chapter>', 'Check rhythm quality')
  .option('-c, --compare <ch1,ch2>', 'Compare rhythm between two chapters')
  .option('-o, --optimize <chapter>', 'Optimize chapter rhythm')
  .action(async (options) => {
    try {
      await initDatabase('novel-data.json');
      const repository = new NovelRepository();
      const rhythmManager = new RhythmManager(repository);

      if (options.analyze) {
        analyzeRhythm(rhythmManager, options.analyze);
      } else if (options.visualize) {
        visualizeRhythm(rhythmManager, options.visualize);
      } else if (options.quality) {
        checkQuality(rhythmManager, options.quality);
      } else if (options.compare) {
        compareRhythm(rhythmManager, options.compare);
      } else if (options.optimize) {
        optimizeRhythm(rhythmManager, options.optimize);
      } else {
        console.log('\n🎵 Rhythm Management\n');
        console.log('Usage: nflow rhythm [options]\n');
        console.log('Options:');
        console.log('  -a, --analyze <id>    Analyze chapter rhythm');
        console.log('  -v, --visualize <id>  Visualize chapter rhythm');
        console.log('  -q, --quality <id>   Check rhythm quality');
        console.log('  -c, --compare <ids>  Compare rhythm between chapters');
        console.log('  -o, --optimize <id>  Optimize chapter rhythm\n');
        console.log('Examples:');
        console.log('  nflow rhythm --analyze 1');
        console.log('  nflow rhythm --visualize 1');
        console.log('  nflow rhythm --quality 1');
        console.log('  nflow rhythm --compare 1,2');
        console.log('  nflow rhythm --optimize 1\n');
      }
    } catch (error) {
      console.error('Error:', error);
      process.exit(1);
    }
  });

function analyzeRhythm(rhythmManager: RhythmManager, chapterId: string): void {
  const chapter = rhythmManager['repository'].getChapter(chapterId);
  
  if (!chapter) {
    console.log(`\n❌ Chapter ${chapterId} not found.\n`);
    return;
  }

  const rhythm = rhythmManager.analyzeChapterRhythm(chapterId);

  console.log(`\n🎵 Rhythm Analysis: ${rhythm.chapterTitle}\n`);
  console.log(`${'='.repeat(50)}\n`);
  console.log(`Overall Pace: ${formatPace(rhythm.overallPace)}`);
  console.log(`Average Intensity: ${rhythm.averageIntensity.toFixed(1)}/10`);
  console.log(`Word Count: ${rhythm.wordCount}`);
  console.log(`Estimated Reading Time: ${rhythm.estimatedReadingTime} minutes\n`);
  
  console.log(`Rhythm Points (${rhythm.rhythmPoints.length}):\n`);
  rhythm.rhythmPoints.forEach((point, index) => {
    const position = (point.position * 100).toFixed(0).padStart(3, '0');
    const intensityBar = '█'.repeat(Math.floor(point.intensity));
    console.log(`  [${position}%] ${intensityBar} ${point.type} (${point.intensity}/10)`);
  });

  console.log(`\n${'='.repeat(50)}\n`);
}

function visualizeRhythm(rhythmManager: RhythmManager, chapterId: string): void {
  const chapter = rhythmManager['repository'].getChapter(chapterId);
  
  if (!chapter) {
    console.log(`\n❌ Chapter ${chapterId} not found.\n`);
    return;
  }

  const rhythm = rhythmManager.analyzeChapterRhythm(chapterId);
  const visualization = rhythmManager.visualizeRhythm(rhythm);

  console.log(visualization);
}

function checkQuality(rhythmManager: RhythmManager, chapterId: string): void {
  const chapter = rhythmManager['repository'].getChapter(chapterId);
  
  if (!chapter) {
    console.log(`\n❌ Chapter ${chapterId} not found.\n`);
    return;
  }

  const rhythm = rhythmManager.analyzeChapterRhythm(chapterId);
  const quality = rhythmManager.analyzeRhythmQuality(rhythm);

  console.log(`\n📊 Rhythm Quality Analysis: ${rhythm.chapterTitle}\n`);
  console.log(`${'='.repeat(50)}\n`);
  console.log(`Quality Score: ${quality.score}/100\n`);

  if (quality.issues.length > 0) {
    console.log('Issues Found:');
    quality.issues.forEach((issue, index) => {
      const icon = issue.severity === 'high' ? '🔴' : issue.severity === 'medium' ? '🟡' : '🟢';
      console.log(`  ${icon} ${index + 1}. [${issue.type}] ${issue.description}`);
      if (issue.position > 0) {
        console.log(`     Position: ${(issue.position * 100).toFixed(0)}%`);
      }
    });
    console.log();
  } else {
    console.log('✅ No issues found!\n');
  }

  if (quality.suggestions.length > 0) {
    console.log('Suggestions:');
    quality.suggestions.forEach((suggestion, index) => {
      console.log(`  ${index + 1}. ${suggestion}`);
    });
    console.log();
  }

  // 根据分数给出建议
  if (quality.score >= 90) {
    console.log('🎉 Excellent rhythm!');
  } else if (quality.score >= 80) {
    console.log('✓ Good rhythm.');
  } else if (quality.score >= 70) {
    console.log('⚠️  Fair rhythm. Consider optimization.');
  } else {
    console.log('❌ Poor rhythm. Needs improvement.');
  }
  console.log();
}

function compareRhythm(rhythmManager: RhythmManager, chaptersStr: string): void {
  const [chapterId1, chapterId2] = chaptersStr.split(',').map(id => id.trim());

  const comparison = rhythmManager.compareRhythm(chapterId1, chapterId2);
  console.log(comparison);
}

function optimizeRhythm(rhythmManager: RhythmManager, chapterId: string): void {
  const chapter = rhythmManager['repository'].getChapter(chapterId);
  
  if (!chapter) {
    console.log(`\n❌ Chapter ${chapterId} not found.\n`);
    return;
  }

  console.log(`\n🎨 Optimizing Rhythm: ${chapter.title}\n`);

  const originalRhythm = rhythmManager.analyzeChapterRhythm(chapterId);
  const quality = rhythmManager.analyzeRhythmQuality(originalRhythm);

  console.log(`Original Quality Score: ${quality.score}/100\n`);

  if (quality.score >= 90) {
    console.log('✅ Rhythm is already excellent. No optimization needed.\n');
    return;
  }

  // 优化节奏
  const optimizedRhythm = rhythmManager.optimizeRhythm(originalRhythm);
  const optimizedQuality = rhythmManager.analyzeRhythmQuality(optimizedRhythm);

  console.log(`Optimized Quality Score: ${optimizedQuality.score}/100\n`);
  console.log(`Improvement: +${optimizedQuality.score - quality.score} points\n`);

  if (optimizedQuality.score > quality.score) {
    console.log('✅ Rhythm optimized successfully!');
    console.log('💡 Note: To apply changes, manually edit the chapter content.\n');
  } else {
    console.log('⚠️  Rhythm could not be improved further.\n');
  }
}

function formatPace(pace: string): string {
  const map: Record<string, string> = {
    slow: '缓慢',
    medium: '中等',
    fast: '快速',
    varied: '多变'
  };
  return map[pace] || pace;
}