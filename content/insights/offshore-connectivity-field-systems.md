---
title: Design field systems for the connection you actually have
description: Offshore and remote-site software fails for a predictable reason. It assumes a network. Here is how we build systems that keep working when the link drops, and what that changes about the architecture.
date: 2026-07-14
author: Cipher4 Engineering
sector: Oil & Gas
readingTime: 6 min read
---

Most operational software fails offshore for the same reason. It was built on a desk in a city, on a connection that never dropped, and it treats the network as something that is simply there.

Then it goes to a platform two hours off the coast, where bandwidth is shared between the safety systems, the crew's welfare traffic and whatever the last vendor installed, and it discovers that "there" is a spectrum rather than a state. The link is up but slow. The link is up but the latency is four seconds. The link is up for six minutes in every hour. The link is down and nobody will say for how long.

A system that assumes a network handles the first case badly and the rest not at all.

## What actually goes wrong

The failure is rarely dramatic. It looks like this:

A technician completes an inspection on a tablet. The form posts, the request hangs, and after thirty seconds it times out. The technician retries. It times out again. He is standing in a hot module with three more items on his list, so he writes the readings on a paper glove liner and carries on. That evening he types some of them into a spreadsheet from memory. Two of the four readings are approximations. Nobody ever knows which two.

The system did not crash. No alert fired. But the record is now fiction, and the integrity engineer onshore will make a decision on it in a fortnight.

The second failure is worse because it is silent. An app queues a submission in memory, the tablet is put on charge, the OS reclaims the process, and the queue goes with it. Nobody was told. The data simply never existed.

## The rule we build to

**Capture is local and synchronous. Transmission is remote and eventual. The two are never the same operation.**

In practice that means when a technician presses save, the record is written to durable local storage on the device and the interface confirms it immediately. That confirmation is honest: the data exists, it is safe, and it will survive a reboot. Whether it has reached shore is a separate question with its own separate indicator.

This sounds obvious. It is routinely got wrong, because the naive implementation (post to the API, show a spinner, show a tick) works perfectly in every test anyone runs in an office.

## What follows from that

Once capture and transmission are separate, several other decisions stop being optional.

**Every record needs an identity generated on the device.** If the server assigns the identifier, the device cannot reference the record until the round trip completes, and you are back to needing a network. Generate a UUID locally at the point of capture and let it be the identity for the record's whole life.

**Sync has to be idempotent.** A device that half-succeeded will retry. If your endpoint creates a new record every time it is called, an intermittent link produces duplicates, and duplicated inspection records are worse than missing ones because they look complete.

**Order cannot be assumed.** A device that has been offline for three days will submit records that predate ones already on the server. Timestamps come from the device, so the server has to accept out-of-order arrivals and sort on the captured time rather than the received time. This also means device clocks matter, and device clocks drift.

**Conflict needs a stated policy, decided before you need it.** Two people edited the same job record while both were offline. Last-write-wins is a policy. Field-level merge is a policy. Flagging for human resolution is a policy. Having no policy is also a policy, and it is the one that loses data.

**Payloads need to be sized for the worst link, not the average one.** A 4MB inspection photograph is not going anywhere over a congested VSAT segment. Compress on the device, upload the record and the images as separate operations, and let the record land without waiting for the media.

## The part that is not technical

Field systems are also judged on whether the person using them can tell what is happening. If a technician cannot see the difference between "saved here" and "sent to shore", they will invent a mental model, and it will be wrong in whichever direction is most convenient at the end of a twelve-hour shift.

We show two states explicitly, in plain language, on every record. Saved on this device. Sent to shore. A count of what is still waiting, visible without navigating anywhere. It is unglamorous, and it is the difference between a system people trust and one they work around.

## Testing it properly

The test that matters is not "does it work offline". It is:

- Airplane mode for four hours of realistic work, then reconnect.
- Force-quit the app mid-sync, reopen it.
- Reboot the device with fifty records queued.
- Throttle the connection to 50kbps with two seconds of latency and packet loss, which is closer to a bad VSAT day than a clean disconnection.
- Let the battery run flat mid-submission.

The throttled case catches more real bugs than the offline case, because a fully absent network takes an obvious code path and a terrible network takes the same path as a good one.

## Why this is worth the effort

An operator does not buy a field system to have a field system. They buy it because the current arrangement produces records they cannot rely on, and decisions made on unreliable records eventually produce an incident, a failed audit, or a piece of equipment that fails earlier than it should have.

A system that quietly loses one record in twenty has not improved on the paper it replaced. It has made the loss harder to notice.

---

*If you are running field data capture in an environment where connectivity is genuinely unreliable and you are not confident about what happens when it fails, that is a conversation worth having. [Get in touch](/contact).*
