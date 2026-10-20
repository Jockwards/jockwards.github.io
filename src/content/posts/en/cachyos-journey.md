---
title: CachyOS
date: 2025-08-21T00:00:00.000Z
lang: en
description: >-
  My journey with CachyOS Linux over the past three weeks - problems, solutions,
  and lessons learned
tags:
  - teknologi
  - personligt
translationOf: cachyos-journey
sourceHash: 7475e12b1bfde37427ff6c19e452ac5d3b01d64cb22515632cc1f4f20fa18266
aiTranslated: true
translationModel: gemini-3.1-flash-lite
translatedAt: '2026-10-20T18:09:01.342Z'
---
I've been running CachyOS for almost three weeks now. It started with problems, and it's still not entirely trouble-free. I struggle with Battle.net almost daily, and there's no really good way to run GeForce Now yet. I also had to install Windows to be able to play the Battlefield 6 beta with a friend.

I made two choices at the beginning that turned out to save me a lot of trouble: Limine as the bootloader and btrfs as the file system. Both choices were based partly on gut feeling, but the CachyOS wiki recommended Limine, so I went with that. I'm not a complete novice Linux user, but I've mostly worked with headless servers in my closet or a PC at work as a test machine. I didn't think I'd need snapshots either, but at the same time, I couldn't find anything really negative about btrfs.

I failed on my very first attempt to install CachyOS. The installation was interrupted. Eventually, I checked their Discord and saw that one or two others had the same problem, and the recommendation was to "try again a bit later."

Sure, okay, I guess it's only in the Linux world that this is an acceptable answer. Wait until the next day, and then I had no problems. Something with the package installer that couldn't download certain packages. Oh well.

It's Friday night now, I've installed CachyOS and am sitting here trying to mount my disks and my closet server. Learning a bit about fstab. Running a system update.

Restart the computer. It won't start. Just a black screen. Great. I go to bed, seriously considering going back to Windows. I know Arch requires some manual intervention, but I don't want the computer to be bricked every time I restart it.

Saturday. I sit down at the computer as usual. I realize it doesn't work, and it feels a bit unsettling that my usual routine of sitting down at the computer is broken. A small thought about dependency drifts through my head.

However, I see that I have snapshots to choose from when I boot. I choose a snapshot from before I installed and tinkered with a bunch of programs. It boots immediately. I figure out which is the latest snapshot that works and stick with that. So, thanks to Limine and btrfs for saving me there. Zero config on my part. It just worked.

A week later, I get a reason to thank my choice of Limine again when I have to dual boot and fix secure boot to get BF6 running. With Limine, it was very easy to get going, and thanks to the CachyOS wiki again for the guidance. However, you have to read the whole text before doing anything. Wiki authors might not be the most pedagogical people on earth. If you had followed the guide step-by-step, you would have missed the line almost at the bottom that says "if you have Limine, you can skip almost all of these steps." Yeah, thanks for that, and lucky I read that far.

It took about a week, then I caught myself sitting down at the computer and starting to use it without even thinking that it was Linux.

As soon as you want to play WoW, however, you are reminded. I've had to use three different apps to be able to start Battle.net. First Lutris, which stopped working, then Bottles, which also stopped working after a while. Then I found Faugust, which I'm running right now and it hasn't let me down so far. WoW runs very well under CachyOS too, so that's nice. Addons via WoWUP, which has a super-fast client.

But that's probably the thorn in the side, the thing that makes it not feel 100%. When you come home from work and want to game a bit, you don't want to start troubleshooting or tinkering. You want to get straight to the game.

I don't mind learning new things or sitting and tinkering back and forth, but sometimes you just want it to work. So it will be a dual boot with Windows for now. But otherwise, it feels fantastic. Linux on the desktop has really come a long way.

I'm using CachyOS, btw.

[![CachyOS Desktop](/assets/media/pics/cachyos-prntscrn.png)](/assets/media/pics/cachyos-prntscrn.png)
